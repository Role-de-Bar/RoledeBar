import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footerAling">
                <div className="Titulofooter">
                    <h2>Rolê de Bar</h2>
                </div>
                <div className="redeSocial">
                    <div>
                        <span>Email:</span>
                        <h3>roledebar@gmail.com</h3>
                    </div>
                    <div className="redeSlid1">
                        <div className="Telefone">
                            <span>Telefone:</span>
                            <h3>(48) 91234-5678</h3>
                        </div>
                        <div className="Politicas">
                            <span>Políticas:</span>
                            <p>política de Privacidade</p>
                            <p>Termos de Serviço</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="linhaFooter"></div>

            <div className="redeSlid2">
                <p className="pFooter">
                    &copy; 2025 Rolê de Bar. Todos os direitos reservados.
                </p>
                <p className="pFooter">
                    <a className="aFooter">Facebook</a> | <a className="aFooter">Instagram</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;