export const validate = (value, res) => {
    if (!value || value == null) {
        res.status(400).json({ error: 'bad input' });
    }
}