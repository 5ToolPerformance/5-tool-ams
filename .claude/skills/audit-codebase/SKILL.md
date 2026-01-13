---
name: audit-codebase
description: Breaks down the codebase and audits for quality, architecture, and best practices. Use when asked to audit the codebase.
---

# Codebase Audit Skill

## Purpose

This skill enables Claude to perform comprehensive codebase audits, providing structured feedback on code quality, architecture, and best practices. Designed for solo developers and small teams who want expert-level code review.

## When to Use This Skill

- User requests a "code audit", "codebase review", or "code analysis"
- User asks Claude to "look at my code" or "review my project"
- User wants feedback on code structure, organization, or best practices
- User mentions wanting to improve code quality or maintainability

## Audit Process

### Step 1: Reconnaissance

Before diving into detailed analysis, understand the project:

```bash
# Navigate to the codebase root
cd /path/to/codebase

# Get project overview
ls -la

# Identify project type and framework
cat package.json  # For Node.js projects
cat requirements.txt  # For Python projects
cat Cargo.toml  # For Rust projects
# etc.

# Check for configuration files
ls -la .*rc* .*config* tsconfig.json .eslintrc* .prettierrc*

# Understand project structure
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" | head -50
tree -L 3 -I 'node_modules|.git|dist|build'  # If tree is available
```

### Step 2: Structural Analysis

Examine the codebase organization:

```bash
# Analyze directory structure
find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | sort

# Check for common architectural patterns
ls -la src/ app/ components/ lib/ utils/ services/ api/ models/

# Look for configuration and documentation
ls -la README.md CONTRIBUTING.md .env.example docs/
```

### Step 3: Deep Dive Analysis

Systematically review key files and patterns:

```bash
# Review entry points
view src/index.ts
view src/app/page.tsx
view src/main.py

# Examine key architectural files
view src/lib/db.ts
view src/app/api/
view src/components/

# Check for code organization patterns
find . -name "*.test.*" -o -name "*.spec.*"
find . -name "types.ts" -o -name "*.types.ts" -o -name "*.d.ts"

# Look for potential issues
grep -r "// TODO" --include="*.ts" --include="*.tsx" --include="*.js"
grep -r "console.log" --include="*.ts" --include="*.tsx" --include="*.js" | wc -l
grep -r "any" --include="*.ts" --include="*.tsx" | wc -l
```

## Audit Report Structure

Provide feedback in this structured format:

### 🎯 Executive Summary

- Brief overview of the codebase
- Overall health score (Good/Fair/Needs Attention)
- Top 3 strengths
- Top 3 areas needing immediate attention

### ✅ What's Working Well

**Architecture & Structure**

- List specific architectural decisions that are strong
- Explain why these decisions are good
- Reference specific files/patterns as evidence

**Code Quality**

- Highlight well-written modules or components
- Point out good use of types, error handling, or abstractions
- Mention consistent patterns being followed

**Best Practices**

- Note adherence to framework conventions
- Recognize good separation of concerns
- Acknowledge proper use of tools (TypeScript, linting, etc.)

### ⚠️ Areas Needing Attention

**Critical Issues** (Fix Soon)

- Security vulnerabilities or anti-patterns
- Performance bottlenecks or obvious inefficiencies
- Missing error handling in critical paths
- Type safety issues (excessive `any`, missing types)

**Important Issues** (Address When Possible)

- Moderate technical debt
- Inconsistent patterns across codebase
- Missing tests for critical functionality
- Documentation gaps

**Minor Issues** (Nice to Have)

- Code style inconsistencies
- Opportunities for DRY improvements
- Minor refactoring opportunities

For each issue:

1. **What**: Clearly state the issue
2. **Where**: Reference specific files/directories
3. **Why it matters**: Explain the impact
4. **How to fix**: Provide actionable guidance

### 💡 Opportunities for Improvement

**Code Organization**

- Suggest restructuring if components/modules are misplaced
- Recommend additional abstraction layers if needed
- Propose better separation of concerns

**Performance & Scalability**

- Identify potential bottlenecks
- Suggest optimization strategies
- Recommend caching or lazy loading where appropriate

**Developer Experience**

- Suggest tooling improvements (linting, formatting, etc.)
- Recommend additional type safety measures
- Propose better error handling patterns

**Testing & Quality**

- Identify untested critical paths
- Suggest testing strategies
- Recommend test coverage goals

**Documentation**

- Point out where inline documentation would help
- Suggest README improvements
- Recommend architecture documentation

### 📊 Detailed Analysis

**Separation of Concerns**

- Evaluate how well business logic is separated from UI
- Check if data access is properly abstracted
- Assess component/module boundaries

**Code Patterns**

- Identify repeated patterns (good and bad)
- Check for consistent error handling
- Evaluate state management approach

**Type Safety** (for TypeScript)

- Count and locate `any` usage
- Check for proper interface/type definitions
- Evaluate use of generics and utility types

**Dependencies**

- Review package.json for outdated or unnecessary dependencies
- Check for security vulnerabilities
- Assess bundle size implications

**Configuration**

- Review environment variable handling
- Check for proper configuration management
- Assess secrets management

### 🎓 Learning Opportunities

Since you're a young developer, highlight specific concepts or patterns you could learn more about based on the codebase analysis.

## Analysis Guidelines

### Be Constructive

- Always explain _why_ something is an issue
- Provide specific, actionable advice
- Balance criticism with recognition of what's working
- Remember this is a learning opportunity

### Be Specific

- Reference actual file paths and line numbers when possible
- Show code examples of issues
- Provide code examples of suggested improvements
- Use concrete metrics where applicable

### Be Contextual

- Consider the project type (startup MVP vs enterprise system)
- Account for the developer's experience level
- Recognize tradeoffs made for speed vs perfection
- Understand that "good enough" is sometimes the right choice

### Be Comprehensive But Concise

- Don't list every minor issue
- Group similar issues together
- Prioritize by impact
- Focus on patterns, not individual instances

## Common Patterns to Check

### Next.js Specific

- Proper use of Server vs Client Components
- API route organization and error handling
- Database connection management (connection pooling)
- Environment variable usage
- Image optimization
- Proper use of dynamic routes and params

### Database (Drizzle ORM / PostgreSQL)

- Schema organization and relationships
- Migration management
- Query optimization (N+1 problems)
- Index usage
- Connection pooling
- Transaction handling

### TypeScript

- Type safety (avoid `any`)
- Proper interface definitions
- Use of discriminated unions
- Generic type usage
- Type inference optimization

### React

- Component composition
- Prop drilling vs context/state management
- Effect usage and cleanup
- Memoization appropriateness
- Key prop usage in lists

### Security

- Input validation
- SQL injection prevention (parameterized queries)
- XSS prevention
- CSRF protection
- Sensitive data exposure
- Authentication/authorization patterns

### Performance

- Bundle size optimization
- Lazy loading opportunities
- Unnecessary re-renders
- Database query efficiency
- Caching strategies

## Example Code Issues to Look For

### Type Safety Issues

```typescript
// ❌ Bad
function processData(data: any) {
  return data.map((item: any) => item.value);
}

// ✅ Good
interface DataItem {
  value: string;
}
function processData(data: DataItem[]) {
  return data.map(item => item.value);
}
```

### Separation of Concerns

```typescript
// ❌ Bad - Business logic in UI component
function UserProfile() {
  const [user, setUser] = useState();

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}

// ✅ Good - Separated into hooks/services
function UserProfile() {
  const { user } = useUser();
  return <div>{user?.name}</div>;
}
```

### Error Handling

```typescript
// ❌ Bad - No error handling
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ Good - Proper error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

## Output Format

Present the audit in markdown format with clear sections, emojis for visual scanning, and code blocks for examples. Make it easy to skim but detailed enough to be actionable.

Always end with encouragement and next steps:

### 🚀 Recommended Next Steps

1. [Most critical item to address]
2. [Second priority]
3. [Third priority]

### 💪 Final Thoughts

- Acknowledge what's working well
- Encourage continued learning
- Remind that code quality is a journey, not a destination
- Offer to dive deeper into any specific area

## Important Notes

- **Don't be condescending**: The user is learning and building something real
- **Be practical**: Not every suggestion needs to be implemented immediately
- **Recognize constraints**: Startup code prioritizes speed and iteration
- **Celebrate wins**: Point out genuinely good decisions and implementations
- **Provide resources**: When suggesting improvements, mention where they can learn more

## Follow-up Capabilities

After providing the audit, offer to:

- Deep dive into any specific area
- Help implement suggested improvements
- Explain any concepts in more detail
- Review specific files more thoroughly
- Help prioritize the recommendations
