import "./Home.css"
import { motion } from "framer-motion";
import Giulia from "../../img/Giulia"
import Anselmo from "../../img/Anselmo"
import Nicolas from "../../img/Nicolas"
import Eliza from "../../img/Eliza"
import VerEstabelecimentos from "../../form/VerEstabelecimentos";
import Footer from "../../layout/Footer";


const membros = [
    {
        key: "Interg1",
        nome: "Anselmo Henrique",
        funcao: "Desenvolvedor",
        Foto: Anselmo,
        bgClass: "Interg1"
    },
    {
        key: "Interg2",
        nome: "Giulia Blanco",
        funcao: "Desenvolvedor",
        Foto: Giulia,
        bgClass: "Interg2"
    },
    {
        key: "Interg3",
        nome: "Eliza Valdiero",
        funcao: "Desenvolvedor",
        Foto: Eliza,
        bgClass: "Interg3"
    },
    {
        key: "Interg4",
        nome: "Nicolas Bitencur",
        funcao: "Desenvolvedor",
        Foto: Nicolas,
        bgClass: "Interg4"
    }
];


const cards = [
    {
        key: "card1",
        cardClass: "card1",
        blurClass: "BlurCard",
        alingClass: "BlurAling",
        textClass: "Cardtext",
        title: "Descubra os Bares",
        desc: "Com filtros personalizados, você encontra bares que combinam com seu estilo: tipo de música, comodidades do ambiente e localização. Deixe que o Rolê de Bar monte o rolê por você!"
    },
    {
        key: "card2",
        cardClass: "card2",
        blurClass: "BlurCard",
        alingClass: "BlurAling",
        textClass: "Cardtext",
        title: "Anuncie seu estabelecimento",
        desc: "Cadastre seu estabelecimento e seja descoberto por quem procura novas experiências, melhorando a visibilidade do seu negócio. A vitrine ideal para quem quer atrair novos clientes de forma moderna."
    },
    {
        key: "card3",
        cardClass: "card3",
        blurClass: "BlurCard",
        alingClass: "BlurAling",
        textClass: "Cardtext",
        title: "Favorite os bares",
        desc: "Você pode adicionar um estabelecimento à sua lista de favoritos, assim vai ser sempre prático e rápido de consultar o endereço e demais dados quando for visita-los."
    },
    {
        key: "card4",
        cardClass: "card4",
        blurClass: "BlurCard",
        alingClass: "BlurAling",
        textClass: "Cardtext",
        title: "Tudo fácil",
        desc: "Fotos, cardápio, eventos e localização num clique."
    },
    {
        key: "card5",
        cardClass: "card5",
        blurClass: "BlurCardExtreme",
        alingClass: "BlurAlingExtreme",
        textClass: "CardtextExtreme",
        title: "Clima certo",
        desc: "De voz e violão a DJ, encontre o lugar com a vibe que combina com você."
    }
];

const gridVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.3
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};



function Home({ setIsLogged, usuarioLogado }) {

    localStorage.setItem("isLogged", "false");
    setIsLogged(false)

    return (
        <main className="home">
            <section className="sectionHome">
                <p className="pHome">Seja bem-vindo(a) ao</p>
                {/* <Letreiro className="letreiro" /> */}
                <h2 className="letreiro">Rolê de Bar</h2>
                <p className="pHome">De bar em bar, sem perder o caminho!</p>
                <VerEstabelecimentos />
            </section>

            <section className="sectionExplore" id="servicos">
                <div className="alignExplore" >
                    <motion.div
                        className="ExploreText"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2>Explore nossos Serviços </h2>
                        <p>Descubra bares incríveis bem pertinho de você, perfeitos para cada tipo de encontro, gosto e ocasião.</p>
                    </motion.div>

                    <div className="ExploreCard">
                        <motion.div
                            className="GridCar"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                        >
                            {cards.map((card, i) => (
                                <motion.div
                                    key={card.key}
                                    className={card.cardClass}
                                    variants={cardVariants}
                                >
                                    <div className={card.blurClass}>
                                        <div className={card.alingClass}>
                                            <motion.div
                                                className={card.textClass}
                                                variants={textVariants}
                                            >
                                                <h2>{card.title}</h2>
                                                <p>{card.desc}</p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="SobreSection" id="sobre">
                <div className="SobreAling" >
                    <motion.article
                        className="SobreText"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2>Time de desenvolvimento</h2>
                        <p>Somos uma equipe de quatro entusiastas da tecnologia e inovação, apaixonados por criar soluções que transformam a maneira como as pessoas aproveitam o lazer.</p>
                    </motion.article>
                    <article className="SobreMembros">
                        {membros.map((membro, i) => (
                            <motion.div
                                key={membro.key}
                                className={membro.bgClass}
                                initial={{ opacity: 0, y:120 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: 0.4 + i * 0.3 }}
                            >
                                <motion.div
                                    className="infoInterg"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: 0.7 + i * 0.3 }}
                                >
                                    <h4>{membro.nome}</h4>
                                    <p>{membro.funcao}</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: 0.9 + i * 0.3 }}
                                >
                                    <membro.Foto className="IntergFoto" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </article>
                </div>
            </section>
           <div id="contato">
             <Footer/>
           </div>
        </main>
    )
}

export default Home;