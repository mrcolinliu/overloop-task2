const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  territory: {
    type: String,
    default: '',
    trim: true
  }
});

/**
 * Validations
 */
ArticleSchema.path('title').validate(title => title.length, 'Title cannot be blank');

mongoose.model('Article', ArticleSchema);

