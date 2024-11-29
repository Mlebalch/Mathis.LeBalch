<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Mon Portfolio</h1>
        <nav>
            <ul>
                <li><a href="#about">À propos</a></li>
                <li><a href="#projects">Projets</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <section id="about">
        <h2>À propos de moi</h2>
        <p>Je suis un développeur web passionné par la création de sites web interactifs et dynamiques.</p>
    </section>
    <section id="projects">
        <h2>Mes Projets</h2>
        <div class="project">
            <h3>Projet 1</h3>
            <p>Description du projet 1.</p>
        </div>
        <div class="project">
            <h3>Projet 2</h3>
            <p>Description du projet 2.</p>
        </div>
    </section>
    <section id="contact">
        <h2>Contactez-moi</h2>
        <form>
            <label for="name">Nom:</label>
            <input type="text" id="name" name="name">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            <label for="message">Message:</label>
            <textarea id="message" name="message"></textarea>
            <button type="submit">Envoyer</button>
        </form>
    </section>
    <?php
    if (isset($_POST['message'])) {
        $entete  = 'MIME-Version: 1.0' . "\r\n";
        $entete .= 'Content-type: text/html; charset=utf-8' . "\r\n";
        $entete .= 'From: webmaster@monsite.fr' . "\r\n";
        $entete .= 'Reply-to: ' . $_POST['email'];

        $message = '<h1>Message envoyé depuis la page Contact de monsite.fr</h1>
    <p><b>Email : </b>' . $_POST['email'] . '<br>
        <b>Message : </b>' . htmlspecialchars($_POST['message']) . '</p>';

    $retour = mail('mlebalch1@gmail.com', 'Envoi depuis page Contact', $message, $entete);
    if($retour)
    echo '<p>Votre message a bien été envoyé.</p>';
    }
    ?>
    <footer>
        <p>&copy; 2024 Mon Portfolio</p>
        <div class="social-links">
            <a href="https://www.linkedin.com/in/mathis-le-balch-3a6778255/" target="_blank">
                <img src="Ressource/Linkedin%20logo.jpg" alt="LinkedIn">
            </a>
            <a href="https://github.com/RIKIKIRITO" target="_blank">
                <img src="Ressource/github-logo-png.png" alt="GitHub">
            </a>
            <a href="Ressource/cv-me.pdf" target="_blank">
                <img src="Ressource/cv-logo.svg" alt="CV">
            </a>
            <a href="mailto:mlebalch1@gmail.com">
                <img src="Ressource/mail-logo.png" alt="Email">
            </a>
        </div>
    </footer>
</body>
</html>