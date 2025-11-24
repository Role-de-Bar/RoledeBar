import jwt from 'jsonwebtoken';

export const authMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Pega o token do header
            const authorization = req.headers.authorization;
            
            if (!authorization) {
                return res.status(401).json({ message: 'Token não fornecido' });
            }

            // Remove o "Bearer " do token
            const token = authorization.replace('Bearer ', '');
            
            // Verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verifica se o usuário tem a role permitida
            if (!allowedRoles.includes(decoded.tipo)) {
                return res.status(403).json({ message: 'Acesso não autorizado' });
            }

            // Adiciona os dados do usuário ao request
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    };
};