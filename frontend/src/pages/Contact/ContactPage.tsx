import { useState } from "react";
import styles from "./contactPage.module.scss";
import { IoMdPaperPlane } from "react-icons/io";
import { useForm } from "react-hook-form";

export interface FormProps {
  email: string;
  title: string;
  message: string;
}

const ContactPage = () => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageData: FormProps = {
      email: email,
      title: title,
      message: message,
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Données renregistrées avec succès:", result);
        setSubmitSuccess(true);

        setTitle("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleChange =
    (setter: (arg0: any) => void) => (event: { target: { value: any } }) => {
      setter(event.target.value);
      if (submitSuccess) {
        setSubmitSuccess(false);
      }
    };

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactHeader}>
        <h1>Contact</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, cum
          quasi labore ad, minus perspiciatis vel deserunt saepe laborum porro
          nemo dicta placeat. Vel nisi sunt neque quaerat at delectus.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange(setEmail)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleChange(setTitle)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={handleChange(setMessage)}
            rows={10}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Envoyer
          <IoMdPaperPlane className={styles.iconPlane} />
        </button>
        {submitSuccess && (
          <p className={styles.submitMessage}>
            Votre message sera traité dans les plus brefs délais.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
