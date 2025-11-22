import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="section-container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-lg text-center mb-8">
              Política de <span className="text-brand-red">Privacidade</span>
            </h1>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 space-y-8 text-gray-300">
              <div className="text-center text-sm text-gray-400 mb-8">
                <p>ÚLTIMA ATUALIZAÇÃO: 19 de outubro de 2025</p>
              </div>

              <section className="space-y-4">
                <p>
                  A <strong>GHENORTRS IMPORTACAO E EXPORTACAO DE ARTIGOS PARA BICICLETAS LTDA</strong>, pessoa jurídica de direito privado, com sede na Avenida Brigadeiro Faria Lima, 2369, Jardim Paulistano, São Paulo/SP, CEP 01452-001, inscrita no CNPJ/MF sob o nº 63.201.320/0001-20 ("Lojista") leva a sua privacidade a sério e zela pela segurança e proteção de dados de todos os seus clientes, parceiros, fornecedores e usuários ("Usuários" ou "você") do site "www.ghenortrs.com.br" e qualquer outro site, Loja, aplicativo operado pelo Lojista (aqui designados, simplesmente, "Loja").
                </p>

                <p>
                  Esta Política de Privacidade ("Política de Privacidade") destina-se a informá-lo sobre o modo como nós utilizamos e divulgamos informações coletadas em suas visitas à nossa Loja e em mensagens que trocamos com você ("Comunicações"). Esta Política de Privacidade aplica-se somente a informações coletadas por meio da Loja.
                </p>

                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-6 my-6">
                  <p className="text-white font-semibold">
                    AO ACESSAR A LOJA, ENVIAR COMUNICAÇÕES OU FORNECER QUALQUER TIPO DE DADO PESSOAL, VOCÊ DECLARA ESTAR CIENTE COM RELAÇÃO AOS TERMOS AQUI PREVISTOS E DE ACORDO COM A POLÍTICA DE PRIVACIDADE, A QUAL DESCREVE AS FINALIDADES E FORMAS DE TRATAMENTO DE SEUS DADOS PESSOAIS QUE VOCÊ DISPONIBILIZAR NA LOJA.
                  </p>
                </div>

                <p>
                  Esta Política de Privacidade fornece uma visão geral de nossas práticas de privacidade e das escolhas que você pode fazer, bem como direitos que você pode exercer em relação aos Dados Pessoais tratados por nós. Se você tiver alguma dúvida sobre o uso de Dados Pessoais, entre em contato com <a href="mailto:contato@ghenortrs.com.br" className="text-brand-red hover:underline">contato@ghenortrs.com.br</a> ou pelos telefones <a href="tel:+5554996538879" className="text-brand-red hover:underline">(54) 99653-8879</a> / <a href="tel:+5554996675459" className="text-brand-red hover:underline">(54) 99667-5459</a>.
                </p>

                <p>
                  Além disso, a Política de Privacidade não se aplica a quaisquer aplicativos, produtos, serviços, site ou recursos de mídia social de terceiros que possam ser oferecidos ou acessados por meio da Loja. O acesso a esses links fará com que você deixe a Loja e possa resultar na coleta ou compartilhamento de informações sobre você por terceiros. Nós não controlamos, endossamos ou fazemos quaisquer representações sobre esses sites de terceiros ou suas práticas de privacidade, que podem ser diferentes das nossas. Recomendamos que você revise a política de privacidade de qualquer site com o qual você interaja antes de permitir a coleta e o uso de seus Dados Pessoais.
                </p>

                <p>
                  Caso você nos envie Dados Pessoais referentes a outras pessoas físicas, você declara ter a competência para fazê-lo e declara ter obtido o consentimento necessário para autorizar o uso de tais informações nos termos desta Política de Privacidade.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Definições</h2>
                <p>Para os fins desta Política de Privacidade:</p>

                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>
                    <strong>"Dados Pessoais"</strong> significa qualquer informação que, direta ou indiretamente, identifique ou possa identificar uma pessoa natural, como por exemplo, nome, CPF, data de nascimento, endereço IP, dentre outros;
                  </li>
                  <li>
                    <strong>"Dados Pessoais Sensíveis"</strong> significa qualquer informação que revele, em relação a uma pessoa natural, origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico;
                  </li>
                  <li>
                    <strong>"Tratamento de Dados Pessoais"</strong> significa qualquer operação efetuada no âmbito dos Dados Pessoais, por meio de meios automáticos ou não, tal como a recolha, gravação, organização, estruturação, armazenamento, adaptação ou alteração, recuperação, consulta, utilização, divulgação por transmissão, disseminação ou, alternativamente, disponibilização, harmonização ou associação, restrição, eliminação ou destruição. Também é considerado Tratamento de Dados Pessoais qualquer outra operação prevista nos termos da legislação aplicável;
                  </li>
                  <li>
                    <strong>"Leis de Proteção de Dados"</strong> significa todas as disposições legais que regulem o Tratamento de Dados Pessoais, incluindo, porém sem se limitar, a Lei nº 13.709/18, Lei Geral de Proteção de Dados Pessoais ("LGPD").
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Uso de Dados Pessoais</h2>
                <p>
                  Coletamos e usamos Dados Pessoais para gerenciar seu relacionamento conosco e melhor atendê-lo quando você estiver adquirindo produtos e/ou serviços na Loja, personalizando e melhorando sua experiência. Exemplos de como usamos os dados incluem:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Viabilizar que você adquira produtos e/ou serviços na Loja;</li>
                  <li>Para confirmar ou corrigir as informações que temos sobre você;</li>
                  <li>Para enviar informações que acreditamos ser do seu interesse;</li>
                  <li>Para personalizar sua experiência de uso da Loja;</li>
                  <li>Para personalizar o envio de publicidades para você, baseada em seu interesse em nossa Loja; e</li>
                  <li>Para entrarmos em contato por um número de telefone e/ou endereço de e-mail fornecido. Podemos entrar em contato com você pessoalmente, por mensagem de voz, através de equipamentos de discagem automática, por mensagens de texto (SMS), por e-mail, ou por qualquer outro meio de comunicação que seu dispositivo seja capaz de receber, nos termos da lei e para fins comerciais razoáveis.</li>
                </ul>

                <p>
                  Além disso, os Dados Pessoais fornecidos também podem ser utilizados na forma que julgarmos necessária ou adequada: (a) nos termos das Leis de Proteção de Dados; (b) para atender exigências de processo judicial; (c) para cumprir decisão judicial, decisão regulatória ou decisão de autoridades competentes, incluindo autoridades fora do país de residência; (d) para proteger nossas operações; (e) para proteger direitos, privacidade, segurança nossos, seus ou de terceiros; (f) para detectar e prevenir fraude; (g) permitir-nos usar as ações disponíveis ou limitar danos que venhamos a sofrer; e (h) de outros modos permitidos por lei.
                </p>

                <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-6 my-6">
                  <p className="text-white font-semibold">
                    A PLATAFORMA NÃO SE DESTINA A PESSOAS COM MENOS DE 18 (DEZOITO) ANOS E PEDIMOS QUE TAIS PESSOAS NÃO NOS FORNEÇAM QUALQUER DADO PESSOAL
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Não fornecimento de Dados Pessoais</h2>
                <p>
                  Você não é obrigado a compartilhar os Dados Pessoais que solicitamos, no entanto, se você optar por não os compartilhar, em alguns casos, não poderemos fornecer a você acesso completo à Loja, alguns recursos especializados ou ser capaz de prestar a assistência necessária ou, ainda, viabilizar a entrega do produto ou prestar o serviço contratado por você.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Dados coletados</h2>
                <p>
                  O público em geral poderá navegar na Loja sem necessidade de qualquer cadastro e envio de Dados Pessoais. No entanto, algumas das funcionalidades da Loja poderão depender de cadastro e envio de Dados Pessoais como concluir a compra/contratação do serviço e/ou a viabilizar a entrega do produto/prestação do serviço por nós.
                </p>

                <h3 className="text-xl font-semibold text-white mt-6">No contato à Loja, nós podemos coletar:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dados de contato.</strong> Nome, sobrenome, número de telefone, cidade, Estado e endereço de e-mail; e</li>
                  <li><strong>Informações que você envia.</strong> Informações que você envia via formulário (dúvidas, reclamações, sugestões, críticas, elogios etc.).</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6">Na navegação geral na Loja, nós poderemos coletar:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Dados de localização.</strong> Dados de geolocalização quando você acessa a Loja;</li>
                  <li><strong>Preferências.</strong> Informações sobre suas preferências e interesses em relação aos produtos/serviços (quando você nos diz o que eles são ou quando os deduzimos do que sabemos sobre você);</li>
                  <li><strong>Dados de navegação na Loja.</strong> Informações sobre suas visitas e atividades na Loja, incluindo o conteúdo (e quaisquer anúncios) com os quais você visualiza e interage, informações sobre o navegador e o dispositivo que você está usando, seu endereço IP, sua localização, o endereço do site a partir do qual você chegou. Algumas dessas informações são coletadas usando nossas Ferramentas de Coleta Automática de Dados, que incluem cookies, web beacons e links da web incorporados;</li>
                  <li><strong>Dados anônimos ou agregados.</strong> Respostas anônimas para pesquisas ou informações anônimas e agregadas sobre como a Loja é usufruída;</li>
                  <li><strong>Outras informações que podemos coletar.</strong> Outras informações que não revelem especificamente a sua identidade ou que não são diretamente relacionadas a um indivíduo, tais como informações sobre navegador e dispositivo; dados de uso da Loja; e informações coletadas por meio de cookies, pixel tags e outras tecnologias.</li>
                </ul>

                <p className="font-semibold">Nós não coletamos Dados Pessoais Sensíveis.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Compartilhamento de Dados Pessoais com terceiros</h2>
                <p>Nós poderemos compartilhar seus Dados Pessoais:</p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Com a(s) empresa(s) parceira(s) que você selecionar ou optar em enviar os seus dados, dúvidas, perguntas etc., bem como com provedores de serviços ou parceiros para gerenciar ou suportar certos aspectos de nossas operações comerciais em nosso nome;</li>
                  <li>Com terceiros, com o objetivo de nos ajudar a gerenciar a Loja; e</li>
                  <li>Com terceiros, caso ocorra qualquer reorganização, fusão, venda, joint venture, cessão, transmissão ou transferência de toda ou parte da nossa empresa, ativo ou capital (incluindo os relativos à falência ou processos semelhantes).</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Transferências internacionais de Dados</h2>
                <p>
                  Dados Pessoais e informações de outras naturezas coletados por nós podem ser transferidos ou acessados por entidades pertencentes ao grupo corporativo das empresas parceiras em todo o mundo de acordo com esta Política de Privacidade.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Forma de coleta automática de Dados Pessoais</h2>
                <p>
                  Quando você visita a Loja, ela pode armazenar ou recuperar informações em seu navegador, seja na forma de cookies e de outras tecnologias semelhantes. Essas informações podem ser sobre você, suas preferências ou seu dispositivo e são usadas principalmente para que a Loja funcione como você espera.
                </p>

                <p>
                  De acordo com esta Política de Privacidade, nós e nossos prestadores de serviços terceirizados podemos coletar seus Dados Pessoais de diversas formas, incluindo, entre outros:
                </p>

                <h3 className="text-xl font-semibold text-white mt-6">Por meio do navegador ou do dispositivo:</h3>
                <p>
                  Algumas informações são coletadas pela maior parte dos navegadores ou automaticamente por meio de dispositivos de acesso à internet, como o tipo de computador, resolução da tela, nome e versão do sistema operacional, modelo e fabricante do dispositivo, idioma, tipo e versão do navegador de Internet que está utilizando.
                </p>

                <h3 className="text-xl font-semibold text-white mt-6">Uso de cookies:</h3>
                <p>
                  Os cookies permitem a coleta de informações tais como o tipo de navegador, o tempo dispendido na Loja, as páginas visitadas, as preferências de idioma, e outros dados de tráfego anônimos. Nós e nossos prestadores de serviços podemos utilizar essas informações para, dentre outros, personalizar sua experiência ao utilizar a Loja, assim como para direcionar publicidade para você, de acordo com os seus interesses.
                </p>

                <p>
                  Caso não deseje que suas informações sejam coletadas por meio de cookies, você pode configurar os cookies no menu "opções" ou "preferências" do seu browser. Nos links abaixo você encontra mais detalhes sobre como ajustar as preferências de cookies dos navegadores de internet mais populares:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-armazenamento-local-de-s" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Internet Explorer</a></li>
                  <li><a href="https://support.microsoft.com/pt-br/help/4027947/microsoft-edge-delete-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Microsoft Edge</a></li>
                  <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Opera</a></li>
                </ul>

                <p className="mt-4">
                  Caso deseje saber um pouco mais sobre os cookies de publicidade e remarketing, que servem para direcionarmos publicidade em função dos interesses de cada usuário e do número de visitas que realizou em nosso site e suas buscas na internet, acesse:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Facebook</a></li>
                  <li><a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Google</a></li>
                  <li><a href="https://about.ads.microsoft.com/pt-br/recursos/politicas/anuncios-personalizados" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">Bing</a></li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Direitos do Usuário</h2>
                <p>Você pode, a qualquer momento, requerer:</p>

                <ul className="list-none space-y-2 ml-4">
                  <li>(i) confirmação de que seus Dados Pessoais estão sendo tratados;</li>
                  <li>(ii) acesso aos seus Dados Pessoais;</li>
                  <li>(iii) correções a dados incompletos, inexatos ou desatualizados;</li>
                  <li>(iv) anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto em lei;</li>
                  <li>(v) portabilidade de Dados Pessoais a outro prestador de serviços;</li>
                  <li>(vi) eliminação de Dados Pessoais tratados com seu consentimento, na medida do permitido em lei;</li>
                  <li>(vii) informações sobre as entidades às quais seus Dados Pessoais tenham sido compartilhados;</li>
                  <li>(viii) informações sobre a possibilidade de não fornecer o consentimento e sobre as consequências da negativa; e</li>
                  <li>(ix) revogação do consentimento.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Segurança dos Dados Pessoais</h2>
                <p>
                  Buscamos adotar as medidas técnicas e organizacionais previstas pelas Leis de Proteção de Dados adequadas para proteção dos Dados Pessoais na nossa organização. Infelizmente, nenhuma transmissão ou sistema de armazenamento de dados tem a garantia de serem 100% seguros. Caso tenha motivos para acreditar que sua interação conosco tenha deixado de ser segura (por exemplo, caso acredite que a segurança de qualquer uma de suas contas foi comprometida), favor nos notificar imediatamente.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Atualizações desta Política de Privacidade</h2>
                <p>
                  Se modificarmos nossa Política de Privacidade, publicaremos o novo texto na Loja, com a data de revisão atualizada. Podemos alterar esta Política de Privacidade a qualquer momento. Caso haja alteração significativa nos termos dessa Política de Privacidade, podemos informá-lo por meio das informações de contato que tivermos em nosso banco de dados ou por meio de notificação em nossa Loja.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white mt-8">Pessoa responsável do tratamento dos Dados Pessoais</h2>
                <p>
                  Caso pretenda exercer qualquer um dos direitos previstos nesta Política de Privacidade e/ou nas Leis de Proteção de Dados, ou resolver quaisquer dúvidas relacionadas ao Tratamento de seus Dados Pessoais, favor contatar-nos através do e-mail <a href="mailto:contato@ghenortrs.com.br" className="text-brand-red hover:underline">contato@ghenortrs.com.br</a> ou pelos telefones <a href="tel:+5554996538879" className="text-brand-red hover:underline">(54) 99653-8879</a> / <a href="tel:+5554996675459" className="text-brand-red hover:underline">(54) 99667-5459</a>.
                </p>

                <p>
                  A pessoa responsável do tratamento dos Dados Pessoais é <strong>Luan Baggio, CPF Nº 023.379.960-50</strong>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PrivacyPolicy;
