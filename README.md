# Pokedex (Next.js)

curl -X POST http://127.0.0.1:5001/v1/tx -H 'Content-Type: applicaton/json' -d '{"command":"{\"type\":\"catch\",\"value\":{\"msg\":\"hi\"}}"}'
0cbaa92114907a941fbc722540eb313ea95f156036629d74038cd0ae5f1a1bd0
curl "http://localhost:5001/v1/state?key=app%2Fpokedex%2F0cbaa92114907a941fbc722540eb313ea95f156036629d74038cd0ae5f1a1bd0"

app/pokedex/0cbaa92114907a941fbc722540eb313ea95f156036629d74038cd0ae5f1a1bd0