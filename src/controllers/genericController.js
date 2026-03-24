import mongoose from 'mongoose';

const create = (model) => (req, res, next) => {
    console.log("from model" + model.modelName);
    
    const author = new model({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });

    return author
        .save()
        .then((result) => res.status(201).json({ result }))
        .catch((error) => res.status(500).json({ error }));
};

const getAll = (model, populate) => (req, res) => {
    return model.find()
        .then((results) => res.status(200).json({ results }))
        .catch((error) => res.status(500).json({ error }));
};

const get = (model, populate) => (req, res) => {
    const id = req.params.id;

    return model.findById(id)
        .then((result) => (result ? res.status(200).json({ result }) 
                                : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const update = (model, populate) => (req, res) => {
    const id = req.params.id;

    return model
        .findOne({_id: id})
        .then((result) => {
            if (result) {
                result.set(req.body);
                return result
                    .save()
                    .then((result) => res.status(201).json({ result }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const delet = (model) => (req, res) => {
    const id = req.params.id;

    return model.findByIdAndDelete(id)
        .then((result) => (result ? res.status(201).json({ result, message: 'Deleted' }) 
                              : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { create, getAll, get, update, delet };
