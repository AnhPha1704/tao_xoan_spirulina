import { NextFunction, Request, Response } from 'express';
import mongoose, { Model , Document } from 'mongoose';

const create = (model: Model<any>) =>(req: Request, res: Response, next: NextFunction) => {
    console.log("from model" + model.modelName);
    
    const author = new model({
        _id: new mongoose.Types.ObjectId(),
        ... req.body
    });

    return author
        .save()
        .then((result: any) => res.status(201).json({ result }))
        .catch((error: any) => res.status(500).json({ error }));
};

const getAll = (model: Model<any>, populate?: string[]) => (req: Request, res: Response) => {
    return model.find<Document>()
        .then((results) => res.status(200).json({ results }))
        .catch((error) => res.status(500).json({ error }));
};

const get = (model: Model<any>, populate?: string[]) => (req: Request, res: Response) => {
    const id = req.params.id;

    return model.findById<Document>(id)
        .then((result) => (result ? res.status(200).json({ result }) 
                                : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const update = (model: Model<any>, populate?: string[]) => (req: Request, res: Response) => {
    const id = req.params.id;

    return model
        .findOne<Document>({_id: id})
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

const delet = (model: Model<any>) => (req: Request, res: Response) => {
    const id = req.params.id;

    return model.findByIdAndDelete<Document>(id)
        .then((result) => (result ? res.status(201).json({ result, message: 'Deleted' }) 
                              : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};


export default {create, getAll, get, update, delet};