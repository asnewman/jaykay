#!/bin/bash
###########################################################
# Starts all project processes in individual tmux panes
###########################################################

SESSION="jaykay-dev"
SPLIT=${SPLIT:-h} # Default split direction (horizontal)

# Start a new tmux session
tmux -2 new-session -d -s "$SESSION"

# Rename the first window and set up the first pane
tmux rename-window -t "$SESSION" "Project Processes"

# Pane 0: Tauri server
tmux select-pane -t 0
tmux send-keys "cd ./app && npm run tauri dev" C-m

tmux split-window -v
tmux select-pane -t 0

# Split horizontally for the second pane (frontend)
tmux split-window -"$SPLIT"
tmux select-pane -t 1
tmux send-keys "cd ./app/src && npm run dev" C-m

# Split vertically from Pane 0 for the third pane (backend)
tmux split-window -"$SPLIT"
tmux select-pane -t 2
tmux send-keys "cd ./backend && node index.js" C-m

# Attach to the session
tmux -2 attach-session -t "$SESSION"
