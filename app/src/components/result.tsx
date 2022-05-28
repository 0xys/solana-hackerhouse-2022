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
    switch (result) {
        case 0:
            varient = 'subtle'
            colorScheme = 'gray'
            break;
        case 1:
            varient = 'outline'
            colorScheme = 'blue'
            break;
        case 2:
            varient = 'subtle'
            colorScheme = 'yellow'
            break;
        case 3:
            varient = 'solid'
            colorScheme = 'orange'
            break;
        case 4:
            varient = 'solid'
            colorScheme = 'red'
            break;
        
        default:
            break;
    }

    return (
        <VStack spacing={2}>
            <Badge variant={varient} colorScheme={colorScheme} fontSize='1.2em'>{result}</Badge>
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