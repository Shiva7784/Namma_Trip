const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const preferenceRoutes = require('./controllers/preferenceController');
const adminRoutes = require('./controllers/userHanlder.js');
const transaction = require('./controllers/transactionHandler.js');
const referrals = require('./controllers/refHandler.js');
const bodyParser = require('body-parser');
const path = require('path'); 
const Payment = require('./controllers/PaymentHandler.js');
const chatRoutes = require('./routes/chat');
const bookingRoutes = require('./routes/bookingRoutes');
const ticketRouter = require('./routes/ticket');
const supportAgentRouter = require('./routes/supportAgent');
const destinationRouter = require('./routes/destination');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const imagePath = require('path');


import('./config/db.js');

const app = express();

app.use(cors({
  
    origin: process.env.FRONTEND_URL, // ✅ correct

    credentials: true
  }));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user', preferenceRoutes);
app.use('/api/user', adminRoutes);
app.use('/api/transaction', transaction);
app.use('/api/referral', referrals);
app.use('/api/payment', Payment);
app.use('/api/chat', chatRoutes);



app.use('/DestinationImages', express.static(imagePath.join(__dirname, 'DestinationImages')));

const PORT = process.env.PORT || 5000;

const EquipmentRouter = require('./routes/Equipment.js');
app.use('/EquipmentImages', express.static(path.join(__dirname, 'EquipmentImages')));
app.use('/equipment', EquipmentRouter);


const tourPackageRouter = require('./routes/tourPackages.js');
app.use('/TourPackageImages', express.static(path.join(__dirname, 'TourPackageImages')));
app.use('/tourPackage', tourPackageRouter);


const BlogRouter = require('./routes/Blog.js');
app.use('/BlogImages', express.static(path.join(__dirname, 'BlogImages')));
app.use('/Blog', BlogRouter);

app.use('/api/bookings', bookingRoutes);


// Use routes
app.use('/tickets', ticketRouter);
app.use('/support-agents', supportAgentRouter);

app.use('/destination', destinationRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});