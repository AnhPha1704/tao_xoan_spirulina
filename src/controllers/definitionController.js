import { Definition } from '../models/Definition.js';

export const getActiveDefinition = async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (activeDef) {
            res.json(activeDef);
        } else {
            res.status(404).json({ message: 'No active definition found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
