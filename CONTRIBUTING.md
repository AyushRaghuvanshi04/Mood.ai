# Contributing to SonifyAI

Thank you for your interest in contributing to SonifyAI! 🎵

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the top right of the repository page
- Clone your forked repository to your local machine

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-fix
```

### 3. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: amazing feature description"
# or
git commit -m "Fix: bug description"
```

### 5. Push to Your Fork
```bash
git push origin feature/amazing-feature
```

### 6. Create a Pull Request
- Go to your forked repository on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Submit the pull request

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's coding standards
- [ ] All tests pass (if applicable)
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets

### PR Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] New tests added (if applicable)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] My changes generate no new warnings
```

## 🎯 Areas for Contribution

### High Priority
- **New Language Support**: Add more languages/regions (e.g., Chinese, Arabic, Russian)
- **Genre Expansion**: Add more genre options for existing languages
- **UI/UX Improvements**: Better mobile experience, animations, accessibility
- **Performance**: Optimize API calls, caching, loading states

### Medium Priority
- **New Features**: 
  - Playlist sharing
  - Collaborative playlists
  - Playlist templates
  - Export to other platforms
- **AI Enhancements**: 
  - Better mood detection
  - Song recommendation algorithms
  - User preference learning

### Low Priority
- **Documentation**: 
  - API documentation
  - Video tutorials
  - Code comments
- **Testing**: 
  - Unit tests
  - Integration tests
  - E2E tests

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm/bun
- Git

### Local Development
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Fill in your environment variables
5. Run the development server: `npm run dev`

### Code Style
- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Prefer functional components with hooks
- Use meaningful variable and function names

### File Structure
```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── generate/       # Generate page
│   └── profile/        # Profile page
├── components/         # Reusable components
├── auth.ts            # NextAuth configuration
└── middleware.ts      # Next.js middleware
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: OS, browser, Node.js version

## 💡 Feature Requests

When suggesting features, please include:
- **Description**: Clear description of the feature
- **Use Case**: Why would this be useful?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other ways to solve the problem

## 📝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

### Expected Behavior
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community

### Unacceptable Behavior
- Harassment, trolling, or discrimination
- Personal attacks or political discussions
- Spam or off-topic discussions
- Any other unprofessional conduct

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: ayush.raghuvanshi2004@gmail.com

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to SonifyAI! 🚀
