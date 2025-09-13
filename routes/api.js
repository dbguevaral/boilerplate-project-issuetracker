'use strict';
require('dotenv').config();
const IssueSchema = require('../models.js');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then( () => console.log('MongoDB connected')).catch( err => console.error('Connection error: ', err));

const getProjectModel = projectName => {
  return mongoose.models[projectName] || mongoose.model(projectName, IssueSchema, projectName);
};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      const filter = { ...req.query};
      const IssueModel = getProjectModel(project);

      if (filter.open !== undefined) {
        if (filter.open === 'true') filter.open = true;
        else if (filter.open === 'false') filter.open = false;
      }

      try {
        const issues = await IssueModel.find(filter);
        return res.json(issues)
      } catch (e) {
        console.error({ error: e.message });
        res.status(500).json({ error: 'No issue matched' })
      }
      
    })
    
    .post(async (req, res) => {
      let project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if (!issue_title || !issue_text || !created_by) return res.json({ error: 'required field(s) missing' });

      const IssueModel = getProjectModel(project)

      try {
        const issue = new IssueModel({
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
        });
        const savedIssue = await issue.save();

        return res.json(savedIssue);

      } catch (e) {
        console.error({ error: 'An error has occured in your POST request'});
        res.status(500).json({ error: 'Internal server error' });
      }
    
    })
    
    .put(async function (req, res) {
      let project = req.params.project;
      const { _id, ...fields} = req.body;
      const IssueModel = getProjectModel(project);
      
      if (!_id) return res.json({ error: 'missing _id' });
      if (!ObjectId.isValid(_id)) return res.json({ error: 'could not update', _id });
      
      const updates = Object.fromEntries(Object.entries(fields).filter(([key, value]) => value !== '' && key !== '_id'));

      if (Object.keys(updates).length === 0) return res.json({ error: 'no update field(s) sent', _id });

      updates.updated_on = new Date();

      try {
        const updated = await IssueModel.findByIdAndUpdate(_id, updates, { runValidators: true})
        if (!updated) return res.json({ error: 'could not update', _id });

        return res.json({ result: 'successfully updated', _id });

      } catch (err) {
        res.status(500).json({ error: 'could not update', _id });
      }
  
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      const IssueModel = getProjectModel(project);

      if (!_id) return res.json({ error: 'missing _id' });
      if (!ObjectId.isValid(_id)) return res.json({ error: 'could not update', _id });

      try {
        const deleted = await IssueModel.findByIdAndDelete(_id);
        if(!deleted) return res.json({ error: 'could not delete', _id })
        res.json({ result: 'successfully deleted', _id });
        
      } catch (err) {
        res.status(500).json({ error: 'could not delete', _id });
      }
    
    });
    
};