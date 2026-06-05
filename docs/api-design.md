# API Design (Initial Plan)

## Authentication

POST /api/auth/register  
→ Register a new user  

POST /api/auth/login  
→ Login user and return tokens  

---

## Users

GET /api/users/profile  
→ Get current user profile  

PUT /api/users/profile  
→ Update user profile  

---

## Projects

POST /api/projects  
→ Create a new project  

GET /api/projects  
→ Get all projects  

GET /api/projects/:id  
→ Get project details  

POST /api/projects/:id/join  
→ Request to join project  

---

## Chat (Planned)

POST /api/messages  
→ Send a message  

GET /api/messages/:projectId  
→ Get messages for a project  

---

## Notes

- Routes follow REST principles  
- Authentication required for protected routes  
- Will evolve as system grows  
