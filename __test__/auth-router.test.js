'use strict';

process.env.SECRET='test';
const jwt = require('jsonwebtoken');
const {server} = require('../src/app');
const supergoose = require('./supergoose.js');
const mockRequest = supergoose(server);

let users = {
  user: {username: 'user', password: 'password'}
};
let usersTwo = {
  user: {username: 'user'}
};
// beforeAll(supergoose.startDB);
// afterAll(supergoose.stopDB);
describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      let encodedToken;
      let id;

      it('can create a user', () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
          });
      });
      it('will return error if required signup credentials are not entered', () => {
        return mockRequest.post('/signup')
          .send(usersTwo[userType])
          .then(results => {
            encodedToken = results.text;
            console.log(results)
            expect(results.status).toBe(500);
          });
      });
      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
          });
      });
    });

  });
});

describe('Categories API', () => {
  test('can create a category', () => {
    const testProduct = {
      name: 'Food',
      description: 'YUM',
    };

    return mockRequest.post('/api/v1/categories')
      .send(testProduct)
      .auth(users[userType].username, users[userType].password)
      .then(results => {
        var token = jwt.verify(results.text, process.env.SECRET);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('Food');
      });
  });

  test('can update a category', () => {

    const testProduct = {
      name: 'Food',
      description: 'YUM',
    };

    const testProductPut = {
      name: 'Food',
      description: 'YUM POST TEST',
    };


    return mockRequest.post('/api/v1/categories')
      .send(testProduct)
      .then(response => {
        return response.body._id;})
      .then(id => {
        return mockRequest.put(`/api/v1/categories/${id}`)
          .send(testProductPut);
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.description).toEqual('YUM POST TEST');
      });
  });
  test('can get a category', () => {

    const testProduct = {
      name: 'Food',
      description: 'YUM',
    };


    return mockRequest.post('/api/v1/categories')
      .send(testProduct)
      .then(response => {
        return mockRequest.get(`/api/v1/categories/${response.body._id}`)
          .then(savedProduct => {
            Object.keys(testProduct).forEach(key =>{
              expect(savedProduct.body[key]).toEqual(testProduct[key]);
            });
          });
      });
  });

  test('can delete a category', () => {

    const testProduct = {
      name: 'Food',
      description: 'YUM',
    };


    return mockRequest.post('/api/v1/categories')
      .send(testProduct)
      .then(response => {
        return mockRequest.delete(`/api/v1/categories/${response.body._id}`)
          .then(savedProduct => {
            expect(savedProduct.req.data).toEqual(undefined);
          });
      });
  });

});


// describe('Authorization API', () => {
//   test('can create a user', () => {
//     const testUser = {
//       username: 'testinguser',
//       password: 'testingpw'
//     };
//
//     return mockRequest.post('/signup')
//       .send(testUser)
//       .then(response => {
//         console.log(response.body)
//         expect(response.status).toEqual(200);
//         expect(response.body).toEqual('Insomnia');
//       });
//   });
// });

// describe('Categories API', () => {
//   test('can create a category', () => {
//     const testProduct = {
//       name: 'Food',
//       description: 'YUM',
//     };
//
//     return mockRequest.post('/api/v1/categories')
//       .send(testProduct)
//       .then(response => {
//         expect(response.status).toEqual(200);
//         expect(response.body.name).toEqual('Food');
//       });
//   });
//
//   test('can update a category', () => {
//
//     const testProduct = {
//       name: 'Food',
//       description: 'YUM',
//     };
//
//     const testProductPut = {
//       name: 'Food',
//       description: 'YUM POST TEST',
//     };
//
//
//     return mockRequest.post('/api/v1/categories')
//       .send(testProduct)
//       .then(response => {
//         return response.body._id;})
//       .then(id => {
//         return mockRequest.put(`/api/v1/categories/${id}`)
//           .send(testProductPut);
//       })
//       .then(response => {
//         expect(response.status).toEqual(200);
//         expect(response.body.description).toEqual('YUM POST TEST');
//       });
//   });
//   test('can get a category', () => {
//
//     const testProduct = {
//       name: 'Food',
//       description: 'YUM',
//     };
//
//
//     return mockRequest.post('/api/v1/categories')
//       .send(testProduct)
//       .then(response => {
//         return mockRequest.get(`/api/v1/categories/${response.body._id}`)
//           .then(savedProduct => {
//             Object.keys(testProduct).forEach(key =>{
//               expect(savedProduct.body[key]).toEqual(testProduct[key]);
//             });
//           });
//       });
//   });
//
//   test('can delete a category', () => {
//
//     const testProduct = {
//       name: 'Food',
//       description: 'YUM',
//     };
//
//
//     return mockRequest.post('/api/v1/categories')
//       .send(testProduct)
//       .then(response => {
//         return mockRequest.delete(`/api/v1/categories/${response.body._id}`)
//           .then(savedProduct => {
//             expect(savedProduct.req.data).toEqual(undefined);
//           });
//       });
//   });
//
// });
//
//
