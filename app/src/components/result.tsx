import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Badge, HStack, Link, VStack, Text } from "@chakra-ui/react"

export const ResultComponent = (prop: {
    result: number,
    batter: string,
    score: number
}) => {

    const {result, batter, score} = prop

    let varient = 'outline'
    let colorScheme = 'blue'
    let resultText = ''
    switch (result) {
        case 0:
            varient = 'subtle'
            colorScheme = 'gray'
            resultText = 'OUT'
            break;
        case 1:
            varient = 'outline'
            colorScheme = 'blue'
            resultText = 'SINGLE'
            break;
        case 2:
            varient = 'subtle'
            colorScheme = 'yellow'
            resultText = 'DOUBLE'
            break;
        case 3:
            varient = 'solid'
            colorScheme = 'orange'
            resultText = 'TRIPLE'
            break;
        case 4:
            varient = 'solid'
            colorScheme = 'red'
            resultText = 'HOMERUN'
            break;
        
        default:
            break;
    }

    return (
        <VStack spacing={2}>
            <Badge variant={varient} colorScheme={colorScheme} fontSize='1.2em'>{resultText}</Badge>
            <HStack spacing={2}>
                <Text fontWeight='bold'>score</Text>
                <Badge variant='solid' colorScheme='blackAlpha'>{score}</Badge>
                <Text fontWeight='bold'>by</Text>
                <Link href={`https://mumbai.polygonscan.com/address/${batter}`} isExternal>
                    {batter.slice(0, 12)}... <ExternalLinkIcon mx='2px'/>
                </Link>
            </HStack>
        </VStack>
    )
}