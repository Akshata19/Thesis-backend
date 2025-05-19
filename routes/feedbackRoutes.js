const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback collection after chatbot interaction
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit feedback after a chatbot interaction
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - chatbotVersion
 *             properties:
 *               name:
 *                 type: string
 *                 example: Priya
 *               age:
 *                 type: integer
 *                 example: 25
 *               gender:
 *                 type: string
 *                 example: Female
 *               occupation:
 *                 type: string
 *                 example: Student
 *               chatbotVersion:
 *                 type: string
 *                 example: chatbot1
 *               chatMessage:
 *                 type: integer
 *                 example: 4
 *               quickReply:
 *                 type: integer
 *                 example: 5
 *               typingIndicator:
 *                 type: integer
 *                 example: 3
 *               persistentMenu:
 *                 type: integer
 *                 example: 4
 *               informationStamp:
 *                 type: integer
 *                 example: 5
 *               sessionMinimization:
 *                 type: integer
 *                 example: 2
 *               conversationClosure:
 *                 type: integer
 *                 example: 4
 *               comments:
 *                 type: string
 *                 example: I liked how the quick replies were integrated into the message layout.
 *     responses:
 *       201:
 *         description: Feedback successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedback saved
 *                 id:
 *                   type: string
 *                   example: 60c72b2f5f1b2c001f9e9a3c
 *       500:
 *         description: Server error while saving feedback
 */
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const saved = await feedback.save();
    res.status(201).json({ message: 'Feedback saved', id: saved._id });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Server error while saving feedback' });
  }
});

module.exports = router;



