const router = require('express').Router();
const DeviceDetector = require('node-device-detector');
const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const ct = require("countries-and-timezones");
const nodemailer = require('nodemailer');
const otplib = require('otplib');
const Users = require('../../schema/base/users');
const Session = require("../../schema/auth/sessions");
const {validateSignupInput,validateLoginInput} = require('../../mid/validations/validations.js')
const size = require('../../mid/limiters/sizeLimiter.js');
const rate = require('../../mid/limiters/rateLimiter.js');
const Verify = require('../../schema/auth/verify.js');

// Login route
router.post('/login', rate({timePeriod :24 * 60 * 60 * 1000, max : 5 }).limit, size(1024).limit, validateLoginInput, async (req, res) => {
    try {

        // Get the Device Information
        const userAgent = req.headers['user-agent'];
        const detector = new DeviceDetector();
        const deviceInfo = detector.detect(userAgent);

        // User Authentication
        const { email, password } = req.body;
        const user = await Users.findOne({ email,password });

        if (!user) {
            return res.status(404).send({ message: 'login failed' });
        }
        
        // Get Location Information
        const clientIp = requestIp.getClientIp(req);
        const geo = geoip.lookup(clientIp);

        let locationInfo = {};
        if (geo) {
            locationInfo = {
                ip: clientIp,
                country_code: geo.country,
                country: ct.getCountry(geo.country)?.name,
                city: geo.city,
                latitude: geo.ll[0],
                longitude: geo.ll[1],
                timezone: geo.timezone,
            };
        }

        const session = await Session.create({ userId: user._id, locationInfo, deviceInfo});
        const { _id } = session;
        res.send({ "token":_id});
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// OTP Generator
const generateOTP = () => {
    const secret = otplib.authenticator.generateSecret();
    return otplib.authenticator.generate(secret);
};
  
// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
   },
});
  
// Send Mail with OTP function
const sendMail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"theonepass" <${process.env.USER}>`,
        to: toEmail,
        subject: "Email Confirmation OTP",
        html: `<p>Your OTP is: ${otp}</p>`,
    };
    try {
        let info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err) {
         throw err;
    }
};
  

// Sign up route
router.post('/signup', rate({timePeriod :24 * 60 * 60 * 1000, max : 5 }).limit, size(1024).limit, validateSignupInput,async (req, res) => {
    const { email, password ,username } = req.body;

    try {
        let confirmedUser = await Users.findOne({ email }) 
        if(confirmedUser){
            return res.status(400).send({ message: 'User already exists' });
        }

        let existingUser = await Verify.findOne({ email })
        if (existingUser) {
            return res.status(400).send({ message: 'OTP already sent, Confirm the otp or try again later 1 day' });
        }

        let user = await Verify.create({ email, password,username, otp : generateOTP()  })
        if (!user) {
            return res.status(404).send({ message: 'signup failed' });
        }

        let info = sendMail(email, user.otp);
        if(!info){
            return res.status(404).send({ message: 'Error in Sending Mail' });
        }
        return res.send({ message: "OTP sent to your email" });    

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }      
});

router.post('/signup/verify', rate({timePeriod :24 * 60 * 60 * 1000, max : 5 }).limit, size(1024).limit, async (req, res) => {
    const { email, otp } = req.body;
    try {
        let confirmedUser = await Users.findOne({ email })
        if(confirmedUser){
            return res.status(400).send({ message: 'User already exists' });
        }
    
        let existingUser = await Verify.findOne({ email })
        if(existingUser.otp !== otp){
            return res.status(400).send({ message: 'Invalid OTP' });
        }
    
        let addConfirmUser = await Users.create({ email: existingUser.email, password: existingUser.password,username: existingUser.username })
        if (!addConfirmUser) {
            return res.status(404).send({ message: 'signup failed' });
        }
    
        await Verify.deleteOne({ email });
        return res.send({ message: "User added successfully" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
        
});

module.exports = router;
