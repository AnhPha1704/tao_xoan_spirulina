import mongoose from 'mongoose';

const create = (model) => async (req, res) => {
    console.log("Creating new document for model: " + model.modelName);

    const item = new model({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });

    try {
        const result = await item.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
};

const getAll = (model, populate = []) => async (req, res) => {
    try {
        // Tự động lọc theo params hoặc query string
        const filter = { ...req.params, ...req.query };
        let query = model.find(filter);
        
        if (populate.length > 0) {
            populate.forEach(p => {
                query = query.populate(p);
            });
        }
        const results = await query.exec();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
};

const get = (model, populate = []) => async (req, res) => {
    try {
        const id = req.params.id || req.params.record_id || req.params.definition_id;
        let query = model.findById(id);
        if (populate.length > 0) {
            populate.forEach(p => {
                query = query.populate(p);
            });
        }
        const result = await query.exec();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
};

const update = (model) => async (req, res) => {
    try {
        const id = req.params.id || req.params.record_id || req.params.definition_id;
        const result = await model.findById(id);

        if (result) {
            result.set(req.body);
            const savedResult = await result.save();
            res.status(201).json(savedResult);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
};

const remove = (model) => async (req, res) => {
    try {
        const id = req.params.id || req.params.record_id || req.params.definition_id;
        const result = await model.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Deleted' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
};

export default { create, getAll, get, update, delete: remove };
