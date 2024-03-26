const router = require('express').Router();
const User = require('../../schema/base/users');
const {validId, validateSignupInput} = require('../../mid/validations/validations.js');
const Sessions = require('../../schema/auth/sessions.js');
const { default: mongoose } = require('mongoose');


// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find();

//         if (!users || users.length === 0) {
//             return res.status(404).send('No users found');
//         }

//         console.log(users);
//         res.status(200).send(users);
//     } catch (error) {
//         console.error('Error fetching users:', error.message);
//         res.status(500).send('Internal Server Error');
//     }
// });

// GET /users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('username email password').lean();

        if (!users || users.length === 0) {
            return res.status(404).send('No users found');
        }

        //console.log(users);
        res.status(200).send(users);
    } catch (error) {
        //console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


// GET /users/:id
router.get('/:id', validId, async(req, res) => {
    const user = await User.find({"_id": req.params.id});
    res.send(user);
});

// POST /users
router.post('/', validateSignupInput, async(req, res) => {
    const user = await User.create(req.body);
    res.send(user);
});

// Get device info - /users/session/sessions
router.get('/session/sessions', async (req, res) => {
    const sessionId = req.headers['id'];
    
    try {
        const session = await Sessions.findById(sessionId);
        const userId = new mongoose.Types.ObjectId(session.userId);
        const userSessions = await Sessions.aggregate([
            {
                $match: { userId }
            },
            {
                $project: {
                    _id : 0,
                    sessionId: "$_id",
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d", 
                            date: "$createdAt"
                        }
                    },
                    time: {
                        $dateToString: {
                            format: "%H:%M:%S", 
                            date: "$createdAt"
                        }
                    },
                    location: "$locationInfo.country",
                    device: "$deviceInfo.client.name"
                }
            }
        ]);

        res.status(200).json({ userId, "count" : userSessions.length ,userSessions });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//delete session - /users/session/:sessionId
router.delete('/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
      const deletedSession = await Sessions.findOneAndDelete({ _id: sessionId });
      if (deletedSession) {
        res.status(200).json({ message: 'Session deleted successfully', deletedSession });
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;