import React, { useState } from 'react';
import FormInput from './FormInput';
import Avatar from './Avatar';
import Button from './Button';
import { SparklesIcon } from '../assets/icons/icons';

const UsernamePopup = ({ isOpen, onClose, onSubmit, allowClose = true }) => {
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
      setUsername('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="card w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative border border-base-200">
        {allowClose && (
          <button
            type="button"
            aria-label="Close popup"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-neutral hover:text-base-content"
            onClick={onClose}
          >
            ✕
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-3">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-base-content">
            Join the Group Order
          </h2>
          <p className="font-body text-xs text-neutral mt-1">
            Enter your display name so friends and the host know whose order is whose.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-1.5 rounded-full bg-base-200/60 border border-base-300/60">
            <Avatar title={username.trim() || '?'} className="w-14 h-14 text-xl font-bold bg-primary text-primary-content" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Your Name"
            type="text"
            placeholder="e.g., Alex, Sarah, Chef Mark"
            value={username}
            onChange={handleUsernameChange}
            required={true}
            maxLength={80}
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-sm font-semibold rounded-xl"
            disabled={!username.trim()}
          >
            Enter Room
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernamePopup;
