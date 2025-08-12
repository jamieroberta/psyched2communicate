'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Event, urlFor } from '@/lib/sanity'

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const isUpcoming = startDate > new Date()
  const isPast = startDate < new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      training: 'bg-blue-100 text-blue-800 border-blue-200',
      workshop: 'bg-green-100 text-green-800 border-green-200',
      meeting: 'bg-gray-100 text-gray-800 border-gray-200',
      conference: 'bg-purple-100 text-purple-800 border-purple-200',
      social: 'bg-pink-100 text-pink-800 border-pink-200',
      other: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getRegionColor = (event: Event) => {
    if (event.region?.color) {
      return event.region.color
    }
    return '#6B7280' // Default gray for events with no region
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900">
                    {event.title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Event Image/Media */}
                {event.media && event.media.length > 0 && (() => {
                  const mediaItem = event.media[0]
                  const isImage = mediaItem._type === 'image'
                  const isPDF = mediaItem._type === 'file'
                  
                  if (isImage) {
                    return (
                      <div className="relative h-64 w-full cursor-pointer group">
                        <a
                          href={urlFor(mediaItem).width(1200).height(800).url()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative h-full w-full"
                        >
                          <Image
                            src={urlFor(mediaItem).width(800).height(400).url()}
                            alt={mediaItem.alt || event.title}
                            fill
                            className="object-cover transition-opacity group-hover:opacity-90"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-25">
                            <div className="bg-white bg-opacity-90 rounded-full p-3">
                              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  } else if (isPDF) {
                    const pdfUrl = mediaItem.asset?.url
                    const fileName = mediaItem.asset?.originalFilename || 'PDF Document'
                    
                    if (!pdfUrl) {
                      return (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
                          <div className="mx-auto h-16 w-16 text-red-400">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-red-900">PDF Not Available</h3>
                          <p className="mt-1 text-xs text-red-600">The PDF file could not be loaded</p>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="relative">
                        {/* PDF Preview */}
                        <div className="relative h-96 w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full"
                            title={fileName}
                          />
                          {/* Overlay for click to open in new tab */}
                          <div className="absolute inset-0 bg-transparent cursor-pointer group flex items-end">
                            <div className="w-full bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-white hover:text-blue-200 transition-colors"
                                onClick={(e) => {
                                  console.log('Event PDF clicked:', pdfUrl)
                                  e.stopPropagation()
                                }}
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="text-sm font-medium">Open full PDF in new tab</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        {/* PDF Info */}
                        <div className="mt-3 text-center">
                          <h3 className="text-sm font-medium text-gray-900">{fileName}</h3>
                          {mediaItem.description && (
                            <p className="mt-1 text-xs text-gray-600">{mediaItem.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Status and Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    {isUpcoming && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        Upcoming
                      </span>
                    )}
                    {isPast && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Past Event
                      </span>
                    )}
                    {event.region && (
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-medium text-white border"
                        style={{ 
                          backgroundColor: getRegionColor(event),
                          borderColor: getRegionColor(event)
                        }}
                      >
                        {event.region.name}
                      </span>
                    )}
                    {!event.region && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600 border border-blue-200">
                        All Regions
                      </span>
                    )}
                  </div>

                  {/* Show content only if no PDF media */}
                  {!(event.media && event.media.length > 0 && event.media[0]._type === 'file') && event.description && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    </div>
                  )}

                  {/* Show compact content for PDF events */}
                  {event.media && event.media.length > 0 && event.media[0]._type === 'file' && event.description && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">About this Event</h4>
                      <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date and Time */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Date & Time</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900">{formatDate(startDate)}</div>
                            <div className="text-sm text-gray-600">
                              {formatTime(startDate)}
                              {endDate && ` - ${endDate.toDateString() === startDate.toDateString() ? formatTime(endDate) : `${formatDate(endDate)} ${formatTime(endDate)}`}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Location</h4>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.isVirtual ? 'Virtual Event' : event.location || 'Location TBD'}
                          </div>
                          {event.isVirtual && (
                            <div className="text-sm text-gray-600">Online meeting</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Info */}
                  {event.registrationRequired && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Registration</h4>
                      <p className="text-gray-700">Registration is required for this event.</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 border-t">
                  {event.isVirtual && event.meetingLink && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Join Meeting
                    </a>
                  )}
                  
                  {event.registrationRequired && event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Register Now
                    </a>
                  )}
                  
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors sm:ml-auto"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}