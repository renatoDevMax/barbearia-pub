import mongoose from 'mongoose';

const DespesaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
  },
  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo'],
  },
  recorrencia: {
    type: String,
    required: [true, 'Recorrência é obrigatória'],
    enum: ['única', 'mensal', 'semanal', 'diária'],
    default: 'única'
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória'],
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Despesa || mongoose.model('Despesa', DespesaSchema);
