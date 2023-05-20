FROM node:latest

WORKDIR /gardendiary


# Create a non-root user
RUN useradd -m node
# Switch to devuser
USER node

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -


# Use shell by default
CMD ["/bin/bash"]


