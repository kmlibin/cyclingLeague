import FantasyTeam from '../models/FantasyTeam.js';
import {StatusCodes} from 'http-status-codes'



//@desc create league
//@route POST /api/leagues
//@access Public
const createTeam = async (req, res) => {
    const { cyclistIds} = req.body
    console.log(req)

    const team = new FantasyTeam({
        cyclists: cyclistIds
    })
    const createdTeam = await team.save()
    console.log(createdTeam)
    res.status(StatusCodes.CREATED).json({createdTeam})
}

//@desc fetch all leagues
//@route GET /api/leagues
//@access Public
// const getAllLeagues = async(req,res) => {
//     try {
//         const leagues = await League.find().populate('cyclists')
//         res.json(leagues)
//     }catch(error) {
//         console.log('error');
//         res.status(500).json({msg: 'internal server error'})
//     }
// }

export {createTeam}