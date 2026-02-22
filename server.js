const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/calculate', (req, res) => {
    try {
        const { power, rpm, mass } = req.body;

        if (!power || !rpm || !mass || power <= 0 || rpm <= 0 || mass <= 0) {
            return res.status(400).json({ error: 'Некорректные входные данные' });
        }

        // Расчёт крутящего момента: M = (P * 9550) / n
        const torque = (power * 9550) / rpm;

        // Упрощённый расчёт максимального угла подъёма
        // Предполагаем, что трактор может преодолеть уклон, когда сила тяги равна силе тяжести
        // F_тяги = M * передаточное число / радиус колеса
        // Для упрощения берём коэффициент 0.3 как соотношение тяги к весу
        const maxSlopeRadians = Math.asin(0.3 * torque / (mass * 9.81));
        const slopeDegrees = (maxSlopeRadians * 180) / Math.PI;

        res.json({
            torque: parseFloat(torque.toFixed(2)),
            slope: parseFloat(slopeDegrees.toFixed(1))
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка расчёта' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
