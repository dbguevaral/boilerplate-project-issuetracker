'use strict';
require('dotenv').config();
const myDb = require('../connection');
const { ObjectId } = require('mongodb');

module.exports = function (app) {
  let project;
  let query;
  let issueTitle;
  let issueText;
  let createdBy;
  let assignedTo;
  let statusText;
  let userIssue;
  let issueId;
  let collection;
  let issues;
  let result;

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      project = req.params.project;
      query = {...req.query};

      if(query.open !== undefined) query.open = query.open === 'true';

      try {
        await myDb (async client => {
          collection = client.db('issueTracker').collection(project);
          issues = await collection.find(query).toArray();
          res.json(issues);
        })
      }
      catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Database collection' });
      };
  
    })
    
    .post(async (req, res) => {
      project = req.params.project;
      issueTitle = req.body.issue_title;
      issueText = req.body.issue_text;
      createdBy = req.body.created_by;
      assignedTo = req.body.assigned_to;
      statusText = req.body.status_text;

      userIssue = {
          assigned_to: assignedTo ? assignedTo.trim() : '',
          status_text: statusText ? statusText.trim() : '',
          open: true,
          _id: new ObjectId(),
          issue_title: issueTitle ? issueTitle.trim() : '',
          issue_text: issueText ? issueText.trim() : '',
          created_by: createdBy ? createdBy.trim() : '',
          created_on: new Date(),
          updated_on: new Date() 
      };

      const requiredFields = {
        issue_title: issueTitle ? issueTitle.trim() : '',
        issue_text: issueText ? issueText.trim() : '',
        created_by: createdBy ? createdBy.trim() : ''
      }

      const atLeastOne = Object.entries(requiredFields).some(([_, value]) => value === undefined || value === '');
      if (atLeastOne) return res.json({ error: 'required field(s) missing' })

      try {
        await myDb (async client => {
          collection = client.db('issueTracker').collection(project);
          await collection.insertOne(userIssue);
          res.json(userIssue);
        })
      }
      catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Database error' });
      };

    })
    
    .put(async function (req, res) {
      project = req.params.project;
      issueId = req.body._id;

      const updates = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      }

      if (req.body.open !== undefined) updates.open = req.body.open === "false" ? false : true;

      if(!issueId) return res.json({ error: 'missing _id' });

      try {
        new ObjectId(issueId)
      }
      catch (e) {
        return res.json({ error: 'could not update', _id: issueId})
      }

      const validUpdates = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));

      if (Object.keys(validUpdates).length === 0) return res.json({ error: 'no update field(s) sent', _id: issueId });

      try {
        await myDb (async client => {
          collection = client.db('issueTracker').collection(project);
          result = await collection.updateOne(
            { _id: new ObjectId(issueId) },
            { $set: {...validUpdates, updated_on: new Date() } }
          )

          if (result.matchedCount === 0) return res.json({ error: 'could not update', '_id': issueId });
          
          res.json({  result: 'successfully updated', _id: issueId })
        })
      }

      catch (e) {
        console.error(e);
        res.json({ error: 'could not update', _id: issueId })
      }

    })
    
    .delete(async function (req, res){
      project = req.params.project;
      issueId = req.body._id;

      if(!issueId) return res.json({ error: 'missing _id' })

      try {
        await myDb (async client => {
          collection = client.db('issueTracker').collection(project);
          result = await collection.deleteOne({_id: new ObjectId(issueId) })
          if(result.deletedCount === 0) return res.json({ error: 'could not delete', '_id': issueId });
          res.json({ result: 'successfully deleted', '_id': issueId })
        })
      }

      catch (e) {
        console.error(e);
        res.json({ error: 'could not delete', '_id': issueId })
      }

    });
    
};