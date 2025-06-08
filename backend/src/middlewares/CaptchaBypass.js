const isDev = process.env.NODE_ENV !== "production";

const CaptchaBypass = (req, res, next) => {
  // Captura o token do reCAPTCHA enviado no corpo
  const token = req.body.token;

  if (isDev) {
    // Em desenvolvimento, ignora a verificação real
    if (!token) {
      return res
        .status(400)
        .json({ message: "Captcha token is required (even in development)" });
    }

    // Log opcional só pra controle
    console.log(
      "⚠️ Captcha verificado via bypass (ambiente de desenvolvimento)"
    );
    return next();
  }

  // Em produção, aqui deveria ir a verificação real com o Google reCAPTCHA
  // Por enquanto, apenas impede se não houver token
  if (!token) {
    return res.status(400).json({ message: "Captcha token is required" });
  }

  // TO-DO: Verificação real pode ser implementada aqui depois
  // Exemplo com fetch ou axios para https://www.google.com/recaptcha/api/siteverify

  return next(); // Provisoriamente permite continuar
};

module.exports = CaptchaBypass;
