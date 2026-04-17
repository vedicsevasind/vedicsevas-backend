python3 -c "
content = '''const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://vedicsevas_user:Vedicsev%40s747@cluster0.fiw6lbv.mongodb.net/vedicsevas?appName=Cluster0';
    const conn = await mongoose.connect(uri);
    console.log('✅ MongoDB Connected: ' + conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB Error: ' + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
'''
with open('/Users/karthikjbreddy/vedicsevas-backend/config/db.js', 'w') as f:
    f.write(content)
print('Done!')
"
