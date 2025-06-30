# Code Quality Setup

This project is configured with modern code quality tools to ensure consistent, high-quality code.

## 🛠️ Tools Configured

### ESLint

- **TypeScript** support with `@typescript-eslint`
- **Svelte** support with `eslint-plugin-svelte`
- **Prettier** integration to avoid conflicts
- Modern flat config format

### Prettier

- Consistent code formatting
- Svelte-specific formatting rules
- Automatic formatting on save

### Husky + lint-staged

- Pre-commit hooks that run before each Git commit
- Automatically fixes issues when possible
- Prevents commits with linting errors

### GitHub Actions

- Runs on every push and pull request
- Tests linting, formatting, type checking, and building
- Security audit checks

## 📜 Available Scripts

```bash
# Run ESLint to check for code issues
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check

# Run all checks (lint + format + type check)
npm run validate

# Type checking with Svelte
npm run check
```

## 🚀 How It Works

### Pre-commit Hooks

When you commit code, Husky automatically runs:

1. **ESLint** - Checks and fixes JavaScript/TypeScript/Svelte issues
2. **Prettier** - Formats code consistently
3. **Only staged files** - Only processes files you're committing

### GitHub Actions CI/CD

On every push/PR to `main` or `develop`:

1. **Lint Check** - Runs ESLint on all code
2. **Format Check** - Verifies code is properly formatted
3. **Type Check** - Runs TypeScript/Svelte type checking
4. **Build Check** - Ensures project builds successfully
5. **Security Audit** - Checks for vulnerable dependencies

## 🔧 Configuration Files

- `eslint.config.js` - ESLint configuration (flat config format)
- `.prettierrc` - Prettier formatting rules
- `.husky/pre-commit` - Pre-commit hook script
- `.github/workflows/ci.yml` - GitHub Actions workflow

## 📋 Linting Rules

### TypeScript Rules

- No unused variables (except those starting with `_`)
- Warns on `any` types
- Enforces proper error handling

### Svelte Rules

- No unused Svelte ignore comments
- Warns on debug tags in production
- Proper Svelte syntax checking

### General Rules

- `console.error` allowed (for error handling)
- Other `console` methods show warnings
- Enforces `const`/`let` over `var`
- No debugger statements

## 🚫 Ignored Files

The following are automatically ignored:

- `legacy/**` - Old Vue.js code
- `dist/**`, `build/**` - Build outputs
- `.svelte-kit/**` - SvelteKit generated files
- `node_modules/**` - Dependencies
- Config files like `*.config.js`

## 🎯 Benefits

1. **Consistent Code Style** - All team members write code the same way
2. **Catch Errors Early** - Find issues before they reach production
3. **Automated Fixes** - Many issues are fixed automatically
4. **Type Safety** - TypeScript catches type-related bugs
5. **Clean Commits** - Only quality code gets committed
6. **CI/CD Integration** - Automated checks on GitHub

## 💡 Tips for Developers

### VS Code Setup

Install these extensions for the best experience:

- ESLint
- Prettier - Code formatter
- Svelte for VS Code

### Common Commands

```bash
# Before committing (optional - hooks do this automatically)
npm run validate

# Fix all auto-fixable issues
npm run lint:fix && npm run format

# Check what the CI will check
npm run validate
```

### Bypassing Hooks (Not Recommended)

```bash
# Only use in emergencies
git commit --no-verify -m "Emergency commit"
```

## 🔍 Troubleshooting

### Pre-commit Hook Issues

If the pre-commit hook fails:

1. Check the error message
2. Run `npm run lint:fix`
3. Run `npm run format`
4. Try committing again

### GitHub Actions Failing

1. Check the Actions tab in your GitHub repo
2. Look at the specific step that failed
3. Run the same command locally to debug
4. Fix the issue and push again

### ESLint Errors

```bash
# See what's wrong
npm run lint

# Try to auto-fix
npm run lint:fix

# If manual fixes needed, edit the files and run again
```

This setup ensures your Svelte TypeScript project maintains high code quality and consistency! 🎉
