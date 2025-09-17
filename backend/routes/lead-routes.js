const express=require("express")
const authMiddleware=require('../middlewares/auth-middleware')
const {createLeads,getLeads,getSpecificLead,updateLead,deleteLead}=require('../controllers/lead-controller')


const router=express.Router();
router.use(authMiddleware)

router.post('/', createLeads);
router.get('/', getLeads);
router.get('/:id', getSpecificLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);


module.exports=router