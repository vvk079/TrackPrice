"use client"
import React from 'react'
import { useState } from 'react'
import { deleteProduct } from '@/app/Action'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from './badge'
import { Button } from './button'
import { ChevronsUp, ChevronsDown, TrendingDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import PriceChart from './PriceChart'

const ProductCard = ({ product }) => {
    const [showChart, setShowChart] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {

        if (!confirm("Are you sure you want to delete this product?")) {
            return
        }
        setDeleting(true)
        const result = await deleteProduct(product.id)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message || "Product deleted successfully")
        }
        setDeleting(false)
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className={"pb-3"}>
                <div className="flex gap-4">
                    {product.img_url && (
                        <img
                            src={product.img_url}
                            alt={product.name}
                            className=" w-20 h-20 rounded-md object-cover border"
                        />
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className='font-semibold text-gray-900 
            line-clamp-2 mb-2'>{product.name}</h3>
                        <div className=' flex items-baseline gap-2'>
                            <span className='text-3xl font-bold text-gray-500'>
                                {product.currency} {product.current_price}
                            </span>
                            <Badge variant="secondary" className="gap-1">
                                <TrendingDown className="w-4 h-4" />
                                Tracking
                            </Badge>
                        </div>


                    </div>

                </div>
            </CardHeader>
            <CardContent >
                <div className='flex flex-wrap gap-2'>
                    <Button variant='outline'
                        onClick={() => setShowChart(!showChart)}>
                        {showChart ? (
                            <>
                                <ChevronsUp className="w-4 h-4" />
                                Hide Chart
                            </>
                        ) : (
                            <>
                                <ChevronsDown className="w-4 h-4" />
                                Show Chart
                            </>
                        )}
                    </Button>
                    <Button variant="outline"
                        size="sm" asChild className="gap-1" >
                        <Link href={product.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Visit Product
                        </Link>

                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
            {showChart && (<CardFooter className="pt-0">
                <PriceChart productId={product.id} />
            </CardFooter>)}
        </Card>
    );
}

export default ProductCard