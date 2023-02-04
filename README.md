<div align="center">
<h3>@caviajs/http-body</h3>
<p>ecosystem for your guinea pig</p>
</div>

## Introduction

This package contains `HttpBody` which can be used to parse request body.

## Usage

### Installation

```shell
npm install @caviajs/http-body --save
```

### Parsing

```typescript
import { HttpBody } from '@caviajs/http-body';

router
  .route({
    handler: async (request, response, next) => {
      // const body = await HttpBody.parse(request, 'stream');
      // const body = await HttpBody.parse(request, 'buffer');
      // const body = await HttpBody.parse(request, 'json');
      // const body = await HttpBody.parse(request, 'string');
    },
  });
```
