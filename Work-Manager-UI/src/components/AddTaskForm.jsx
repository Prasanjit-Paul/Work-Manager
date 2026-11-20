import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Select } from '@mui/material';
import { INK, hard, importanceColor, fieldSx } from '../constants/boardConfig';

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState('Main Task');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description: description || 'No description provided',
      stage: 'DRAFT',
      importance,
    });

    setTitle('');
    setDescription('');
    setImportance('Main Task');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5 }}
    >
      <TextField
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={fieldSx}
        slotProps={{ htmlInput: { 'aria-label': 'Task title' } }}
      />
      <TextField
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={fieldSx}
        slotProps={{ htmlInput: { 'aria-label': 'Description' } }}
      />
      <Select
        value={importance}
        onChange={(e) => setImportance(e.target.value)}
        sx={{ ...fieldSx, minWidth: 180 }}
        inputProps={{ 'aria-label': 'Importance' }}
      >
        {Object.keys(importanceColor).map((v) => (
          <MenuItem key={v} value={v}>{v}</MenuItem>
        ))}
      </Select>
      <Button
        type="submit"
        sx={{
          bgcolor: '#ff5da2',
          color: INK,
          fontWeight: 700,
          fontSize: 15,
          px: 4,
          textTransform: 'none',
          borderRadius: '10px',
          border: `3px solid ${INK}`,
          boxShadow: hard(4),
          '&:hover': { bgcolor: '#ff7ab4' },
          '&:active': { boxShadow: 'none', transform: 'translate(4px, 4px)' },
        }}
      >
        Add task
      </Button>
    </Box>
  );
}