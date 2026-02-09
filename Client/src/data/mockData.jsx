import React from 'react';
import { Shield, Code2, MessageSquare, User, Monitor } from 'lucide-react';

export const INITIAL_TASKS = [
  { id: 1, title: 'Configure VPN Access', category: 'IT Setup', status: 'completed', icon: <Shield size={18} /> },
  { id: 2, title: 'Install VS Code & Extensions', category: 'Dev Environment', status: 'pending', icon: <Code2 size={18} /> },
  { id: 3, title: 'Join Slack Workspace', category: 'Communication', status: 'pending', icon: <MessageSquare size={18} /> },
  { id: 4, title: 'Set up Corporate Email Signature', category: 'Communication', status: 'pending', icon: <User size={18} /> },
  { id: 5, title: 'Request GitHub Access', category: 'Access', status: 'pending', icon: <Monitor size={18} /> },
];

export const COURSES = [
  { 
    id: 1, 
    title: 'Engineering Bootcamp', 
    subtitle: 'Module 1: Coding Standards', 
    progress: 65, 
    totalModules: 8,
    required: true,
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 2, 
    title: 'Security Awareness', 
    subtitle: 'Data Privacy 101', 
    progress: 0, 
    totalModules: 3,
    required: true,
    color: 'bg-orange-100 text-orange-700'
  },
  { 
    id: 3, 
    title: 'Company Culture', 
    subtitle: 'Values & Mission', 
    progress: 100, 
    totalModules: 1,
    required: false,
    color: 'bg-green-100 text-green-700'
  },
];

export const CHAT_HISTORY = [
  { id: 1, sender: 'bot', text: 'Welcome to NexBoard, Alex! I am your AI onboarding companion. I can help you with setup guides, benefits info, or finding the right documentation.' },
  { id: 2, sender: 'bot', text: 'I noticed you still need to set up your IDE. Would you like the recommended extension list?' },
];