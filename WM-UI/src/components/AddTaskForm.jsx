import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Select } from '@mui/material';
import { INK, SHADOW, FONT, importanceColor, fieldSx, controlSx, primaryBtnSx } from '../constants/boardConfig';

export default function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState('Main Task');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      description: description.trim() || 'No description provided',
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
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5, alignItems: 'flex-start' }}
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
        sx={{ ...controlSx, minWidth: 190 }}
        inputProps={{ 'aria-label': 'Importance' }}
        MenuProps={{ slotProps: { paper: { sx: { borderRadius: '18px', mt: 1, boxShadow: SHADOW } } } }}
      >
        {Object.keys(importanceColor).map((v) => (
          <MenuItem key={v} value={v} sx={{ fontFamily: FONT, fontWeight: 700, color: INK }}>
            {v}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" sx={primaryBtnSx}>
        Add task
      </Button>
    </Box>
  );
}