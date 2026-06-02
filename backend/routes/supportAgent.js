const express = require('express');
const { body, validationResult } = require('express-validator');
const SupportAgent = require('../models/supportAgent');

const router = express.Router();

// Add a new support agent
router.post('/add', [
  body('name')
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters.'),
  
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  
  body('phone')
    .isString()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters.'),
  
  body('role')
    .isIn(['Admin', 'Support', 'Technician'])
    .withMessage('Role must be one of Admin, Support, or Technician.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, role } = req.body;
    const newSupportAgent = new SupportAgent({ name, email, phone, role });
    await newSupportAgent.save();

    res.status(201).json({ success: true, message: 'Support agent created successfully', supportAgent: newSupportAgent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating support agent' });
  }
});

// Get all support agents
router.get('/', async (req, res) => {
  try {
    const supportAgents = await SupportAgent.find();
    res.status(200).json({ success: true, data: supportAgents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching support agents' });
  }
});

// Update an existing support agent
router.put('/:id', [
  body('name').optional().isString().isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters.'),
  body('email').optional().isEmail().withMessage('Email must be a valid email address.'),
  body('phone').optional().isString().isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 characters.'),
  body('role').optional().isIn(['Admin', 'Support', 'Technician']).withMessage('Role must be one of Admin, Support, or Technician.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const agentId = req.params.id;
    const { name, email, phone, role } = req.body;
    const updatedSupportAgent = { name, email, phone, role };
    const result = await SupportAgent.findByIdAndUpdate(agentId, updatedSupportAgent, { new: true });

    if (!result) {
      return res.status(404).json({ error: 'Support agent not found' });
    }

    res.status(200).json({ success: true, message: 'Support agent updated successfully', supportAgent: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating support agent' });
  }
});

// Delete a support agent
router.delete('/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const result = await SupportAgent.findByIdAndDelete(agentId);
    if (!result) {
      return res.status(404).json({ error: 'Support agent not found' });
    }
    res.status(200).json({ success: true, message: 'Support agent deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting support agent' });
  }
});

// Get a specific support agent
router.get('/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const supportAgent = await SupportAgent.findById(agentId);
    if (!supportAgent) {
      return res.status(404).json({ error: 'Support agent not found' });
    }
    res.status(200).json({ success: true, message: 'Support agent fetched successfully', supportAgent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching support agent' });
  }
});

module.exports = router;
