I think I want each challenge type to be able to control its own destiny.
I could do this in the one +page.server.ts file, based on challenge type,
or I could have it route to a different place based on challenge type.

For framed, I could add a new model for a framed response or I could put them in the response.
I will want to allow movement between images, but disable inputs when there is a response for that image.
On the backend, we won't accept a response for an image that already has a response.
Does cldImages need an order field?

NEXT

I'm working on the framed form.

- Need to see what it actually looks like at the moment
- Need to handle the submit action, including handling when this is or isn't the last image, and when this framed is or isn't the last challenge in the set.
- Need to handle when the answer is correct and when it's not.
- Need to make the review look basically the same as the form, in some way that makes sense. Make the carousel start on the last-answered image. Make the carousel controls like Framed, both on review and on form.
