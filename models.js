const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema ({
    issue_title: { type: String },
    issue_text: { type: String },
    created_by: { type: String },
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    open: { type: Boolean, default: true},
});

module.exports = IssueSchema;