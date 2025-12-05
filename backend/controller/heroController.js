import heroModel from '../model/heroModel.js'

export const getHero = async (req, res) => {
    try{
        const hero = await heroModel.find()
        res.status(200).json(hero)
    }
    catch(err){
        res.status(500).json(err)
    }
}

export const postHero = async (req, res) => {
    try{
        const hero = new heroModel(req.body)
        await hero.save()
        res.status(200).json(hero)
    }
    catch(err){
        res.status(500).json(err)
    }
}

export const deleteHero = async (req, res) => {
    try{
        const hero = await heroModel.findByIdAndDelete(req.params.id)
        res.status(200).json(hero)
    }
    catch(err){
        res.status(500).json(err)
    }
}
 export const putHero=async(req,res)=>{
    try{
        const id=req.params.id
        const hero = await heroModel.findByIdAndUpdate(id, req.body, {new:true})
        res.status(200).json(hero)
    }
    catch(err){
        res.status(500).json(err)
    }
}
