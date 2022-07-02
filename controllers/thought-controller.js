const { Thought, User } = require('../models');

const thoughtController = {

    getThoughts(req, res) {
        Thought.find({})
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getThoughtByID({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
addThought(req, res) {
    Thought.create(req.body)
        .then((thoughtData) => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thoughtData._id } },
            { new: true }
        );
        })
        .then((userData) => {
        if (!userData) {
            return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }

        res.json({ message: 'Thought successfully created!' });
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
        });
    },

    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.thoughtId }, body, { runValidators: true, new: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    deleteThought({ params }, res) {
        Thought.findByIdAndDelete({ _id: params.thoughtId }, { runValidators: true, new: true })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    addReaction({params, body}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}},
            { new: true, runValidators: true }
        )
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: 'Incorrect reaction data!' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    },
    deleteReaction({params}, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$pull: {reactions: {reactionId : params.reactionId}}},
            { new: true, runValidators: true }
        )
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: 'Incorrect reaction data!' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    }
}


module.exports = thoughtController;