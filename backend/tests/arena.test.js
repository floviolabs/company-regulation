const request = require('supertest');
const app = require('../app');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhVG9rZW4iOnt9LCJpYXQiOjE2OTIxNzEyOTd9.phj3iN8v5GtVBqxVAnCZHDEYONpvF42QgAVUhX425Ec';

describe('Category', () => {
  it('should return category list', async () => {
    const response = await request(app)
      .post('/api/v1/categories/get-all')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('add category', async () => {
    const response = await request(app)
      .post('/api/v1/categories/submit')
      .send({ in_mcat_name: 'New Cat', in_mcat_isactive:true })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('update category', async () => {
    const response = await request(app)
      .post('/api/v1/categories/submit')
      .send({ in_mcat_id: '10', in_mcat_name: 'New Cate', in_mcat_isactive:true })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('delete category', async () => {
    const response = await request(app)
      .post('/api/v1/categories/delete')
      .send({ in_mcat_id: '10' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });
});

describe('Menu', () => {
  it('should return menu list', async () => {
    const response = await request(app)
      .post('/api/v1/menus/get-all')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('add menu', async () => {
    const response = await request(app)
      .post('/api/v1/menus/submit')
      .send({ in_mmen_mcat_id:'1',in_mmen_name:'new menu',in_mmen_link:'url',in_mmen_sso_key:'sso',in_mmen_icon:'icon',in_mmen_image:'image',in_mmen_isactive:true })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('update menu', async () => {
    const response = await request(app)
      .post('/api/v1/menus/submit')
      .send({ in_mmen_id: '10', in_mmen_mcat_id:1,in_mmen_name:'new menu',in_mmen_link:'url',in_mmen_sso_key:'sso',in_mmen_icon:'icon',in_mmen_image:'image',in_mmen_isactive:true })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('delete menu', async () => {
    const response = await request(app)
      .post('/api/v1/menus/delete')
      .send({ in_mmen_id: '10' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });
});


describe('Login API', () => {
  it('should return a JWT token upon successful login', async () => {
    const response = await request(app)
      .post('/api/v1/access/login')
      .send({ username: 'tria.ramadhan', password: 'U2FsdGVkX1/utgRRFWHtKU4oaIgTHjspmWssXZRbHOA=' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });

  it('should return an error for invalid login', async () => {
    const response = await request(app)
      .post('/api/v1/access/login')
      .send({ username: 'tria.cahya', password: 'Aeon.123' });
      // .set('Authorization', `Bearer ${token}`);
      // console.log("Response", JSON.stringify(response));
      // console.log("Response", response.body.status);
    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
  });
});

describe('Show Email and Name', () => {
  it('should return email list', async () => {
    const response = await request(app)
      .post('/api/v1/access/get-email');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });
});

describe('Check Admin Status', () => {
  it('should return 1 as admin', async () => {
    const response = await request(app)
      .post('/api/v1/access/check-status')
      .send({ in_email:"tria.ramadhan@aeonindonesia.co.id" });
    expect(response.status).toBe(200);
    expect(response.body.data).toBe(1);
  });

  it('should return 0 as user', async () => {
    const response = await request(app)
      .post('/api/v1/access/check-status')
      .send({ in_email:"teguh.wiratama@aeonindonesia.co.id" });
    expect(response.status).toBe(200);
    expect(response.body.data).toBe(0);
  });
});