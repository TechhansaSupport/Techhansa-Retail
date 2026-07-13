export default function Contact() {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>Have a question or need support? We are here to help.</p>
      
      <div className="contact-info">
        <p><strong>Email:</strong> support@techhansaretail.com</p>
        <p><strong>Phone:</strong> +1 (800) 555-0198</p>
        <p><strong>Headquarters:</strong> 123 Tech Boulevard, Innovation City, TX 75001</p>
      </div>

      <div className="dummy-form">
        <h3>Send us a message</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Name: </label>
            <input type="text" placeholder="John Doe" />
          </div>
          <br />
          <div>
            <label>Email: </label>
            <input type="email" placeholder="john@example.com" />
          </div>
          <br />
          <div>
            <label>Message: </label>
            <textarea placeholder="How can we help you?" rows="4"></textarea>
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}