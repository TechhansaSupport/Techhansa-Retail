const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  attachmentsMetadata: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
