const mongoose = require('mongoose');

const favoriteSceneSchema = new mongoose.Schema({
  sceneId: String,
  timestamps: {
    createdAt: Date,
    updatedAt: Date,
  },
});

module.exports = mongoose.model('FavoriteScene', favoriteSceneSchema);
