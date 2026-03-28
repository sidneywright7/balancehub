const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  { name: 'Fitness', description: 'Workouts, exercise tips, and staying active' },
  { name: 'Meditation', description: 'Mindfulness, breathing, and mental clarity' },
  { name: 'Sleep', description: 'Sleep hygiene, routines, and rest tips' },
  { name: 'Nutrition', description: 'Healthy eating, diets, and meal planning' },
  { name: 'Mental Health', description: 'Emotional wellness, stress, and self care' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log('Categories seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
