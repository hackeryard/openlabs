import { connectDB } from './app/lib/mongodb';
import mongoose from 'mongoose';
import DailyChallenge from './app/models/DailyChallenge';

async function run() {
  await connectDB();
  const res = await DailyChallenge.deleteMany({ labId: 'computer-science/code-lab/js' });
  console.log('Deleted records:', res.deletedCount);
  process.exit(0);
}
run();
