'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const matrixHill = [
    [3, 3],
    [2, 5],
]
const inverseMatrixHill = [
    [15, 17],
    [20, 9],
]

function removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const PADDING_CHAR = '*'

function encryptHill(plainText: string, matrix: number[][]): string {
    const cleanedText = removerAcentos(plainText)
        .replace(/[^A-Z]/g, '')
        .toUpperCase()

    const paddedText =
        cleanedText.length % 2 === 0 ? cleanedText : cleanedText + PADDING_CHAR

    const textNumbers = paddedText
        .split('')
        .map((char) => char.charCodeAt(0) - 65)

    const encryptedNumbers = []

    for (let i = 0; i < textNumbers.length; i += 2) {
        const a = textNumbers[i]
        const b = textNumbers[i + 1]

        encryptedNumbers.push(
            (matrix[0][0] * a + matrix[0][1] * b) % 26,
            (matrix[1][0] * a + matrix[1][1] * b) % 26
        )
    }

    return encryptedNumbers.map((num) => String.fromCharCode(num + 65)).join('')
}

function decryptHill(cipherText: string, inverseMatrix: number[][]): string {
    const cleanedText = cipherText.replace(/[^A-Z]/g, '').toUpperCase()

    const textNumbers = cleanedText
        .split('')
        .map((char) => char.charCodeAt(0) - 65)

    const decryptedNumbers = []

    for (let i = 0; i < textNumbers.length; i += 2) {
        const a = textNumbers[i]
        const b = textNumbers[i + 1] || 0

        decryptedNumbers.push(
            (inverseMatrix[0][0] * a + inverseMatrix[0][1] * b) % 26,
            (inverseMatrix[1][0] * a + inverseMatrix[1][1] * b) % 26
        )
    }

    let result = decryptedNumbers
        .map((num) => String.fromCharCode(((num + 26) % 26) + 65))
        .join('')

    if (result.endsWith(PADDING_CHAR)) {
        result = result.slice(0, -1)
    }

    return result
}

function encryptVigenere(text: string, key: string): string {
    const cleanedText = removerAcentos(text)
        .replace(/[^A-Z]/g, '')
        .toUpperCase()
    const cleanedKey = key.replace(/[^A-Z]/g, '').toUpperCase()

    if (cleanedKey.length === 0) return cleanedText

    let result = ''

    for (let i = 0; i < cleanedText.length; i++) {
        const textChar = cleanedText.charCodeAt(i) - 65
        const keyChar = cleanedKey.charCodeAt(i % cleanedKey.length) - 65
        result += String.fromCharCode(((textChar + keyChar) % 26) + 65)
    }

    return result
}

function decryptVigenere(text: string, key: string): string {
    const cleanedText = text.replace(/[^A-Z]/g, '').toUpperCase()
    const cleanedKey = key.replace(/[^A-Z]/g, '').toUpperCase()

    if (cleanedKey.length === 0) return cleanedText

    let result = ''

    for (let i = 0; i < cleanedText.length; i++) {
        const textChar = cleanedText.charCodeAt(i) - 65
        const keyChar = cleanedKey.charCodeAt(i % cleanedKey.length) - 65
        result += String.fromCharCode(((textChar - keyChar + 26) % 26) + 65)
    }

    return result
}

export default function Home() {
    const [text, setText] = useState('')
    const [key, setKey] = useState('')
    const [cipherType, setCipherType] = useState('hill')
    const [output, setOutput] = useState('')
    const [isEncrypted, setIsEncrypted] = useState(false)

    const handleEncrypt = () => {
        if (!text) return

        if (cipherType === 'hill') {
            setOutput(encryptHill(text, matrixHill))
        } else {
            if (!key) {
                alert('Por favor, insira uma chave para a cifra de Vigenère')
                return
            }
            setOutput(encryptVigenere(text, key))
        }
        setIsEncrypted(true)
    }

    const handleDecrypt = () => {
        if (!text) return

        if (cipherType === 'hill') {
            setOutput(decryptHill(text, inverseMatrixHill))
        } else {
            if (!key) {
                alert('Por favor, insira uma chave para a cifra de Vigenère')
                return
            }
            setOutput(decryptVigenere(text, key))
        }
        setIsEncrypted(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="p-6 w-96">
                <CardHeader>
                    <CardTitle>Criptografia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Texto"
                        value={text}
                        onChange={(e) => setText(e.target.value.toUpperCase())}
                    />
                    {cipherType === 'vigenere' && (
                        <Input
                            placeholder="Chave"
                            value={key}
                            onChange={(e) =>
                                setKey(e.target.value.toUpperCase())
                            }
                        />
                    )}
                    <select
                        className="w-full p-2 border rounded"
                        onChange={(e) => setCipherType(e.target.value)}
                    >
                        <option value="hill">Hill</option>
                        <option value="vigenere">Vigenère</option>
                    </select>
                    <div className="flex space-x-2">
                        <Button onClick={handleEncrypt} className="flex-1">
                            Criptografar
                        </Button>
                        <Button
                            onClick={handleDecrypt}
                            variant="outline"
                            className="flex-1"
                        >
                            Descriptografar
                        </Button>
                    </div>
                    {output && (
                        <div className="mt-4 p-3 border rounded bg-gray-200">
                            <p className="font-medium">Resultado:</p>
                            <p className="break-all">{output}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
