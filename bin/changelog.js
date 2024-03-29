#!/usr/bin/env node
import changelog from 'conventional-changelog';

const semver_regex = /\bv?(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/ig;

const commitPartial = ` - {{header}}

{{~!-- commit hash --}} {{#if @root.linkReferences}}([{{hash}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/{{@root.commit}}/{{hash}})){{else}}{{hash~}}{{/if}}

{{~!-- commit references --}}{{#if references}}, closes{{~#each references}} {{#if @root.linkReferences}}[{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/{{@root.issue}}/{{this.issue}}){{else}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}{{/if}}{{/each}}{{/if}}
`;

const headerPartial = `## {{version}}{{#if title}} "{{title}}"{{/if}}{{#if date}} - {{date}}{{/if}}
`;

changelog({
  releaseCount: 19,
  // preset: 'jshint'
}, null, null, null, {
  transform(commit) {
    if (commit.header && semver_regex.exec(commit.header)) {
      return null;
    }
    return commit;
  },
  commitPartial: commitPartial,
  headerPartial: headerPartial
}).pipe(process.stdout);
