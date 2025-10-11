import React, { useState } from 'react';
import { Headphones, MessageSquare, Video, Phone, Clock, Star, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const PrioritySupportCard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const supportTickets = [
    {
      id: 1,
      title: 'Report generation is slow',
      status: 'open',
      priority: 'high',
      createdAt: '2 hours ago',
      lastMessage: 'The system is taking longer than usual to generate reports.',
      agent: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Need help with API integration',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '1 day ago',
      lastMessage: 'Working on the integration example for you.',
      agent: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Custom branding not working',
      status: 'resolved',
      priority: 'low',
      createdAt: '3 days ago',
      lastMessage: 'Issue has been resolved. Your branding should now work correctly.',
      agent: 'Emily Davis'
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'agent',
      name: 'Sarah Johnson',
      message: 'Hi! I\'m Sarah, your dedicated support agent. How can I help you today?',
      timestamp: '10:30 AM',
      avatar: null
    },
    {
      id: 2,
      sender: 'user',
      name: 'You',
      message: 'I\'m having trouble with the report generation. It\'s taking too long.',
      timestamp: '10:32 AM',
      avatar: null
    },
    {
      id: 3,
      sender: 'agent',
      name: 'Sarah Johnson',
      message: 'I understand your concern. Let me check your account and see what might be causing the delay.',
      timestamp: '10:33 AM',
      avatar: null
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add message to chat
      console.log('Sending message:', message);
      setMessage('');
      setIsTyping(true);
      // Simulate agent typing
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-5 h-5" />
          Priority Support
        </CardTitle>
        <CardDescription>
          Get dedicated support with faster response times and priority assistance for your business needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold">Live Chat</h4>
              <p className="text-sm text-gray-600">Instant support</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Video className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-semibold">Video Call</h4>
              <p className="text-sm text-gray-600">Screen sharing</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Available</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Phone className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold">Phone Support</h4>
              <p className="text-sm text-gray-600">Direct call</p>
              <Badge className="mt-2 bg-green-100 text-green-800">24/7</Badge>
            </div>
          </div>

          {/* Support Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'chat' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              Live Chat
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'tickets' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('tickets')}
            >
              Support Tickets
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'resources' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sarah Johnson is online</span>
                  <Badge variant="outline">Dedicated Agent</Badge>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border'
                      }`}>
                        <div className="text-sm">{msg.message}</div>
                        <div className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 justify-start">
                      <div className="bg-white border p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button type="submit" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Support Tickets</h4>
                <Button size="sm">Create Ticket</Button>
              </div>
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{ticket.title}</h5>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.lastMessage}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created {ticket.createdAt}</span>
                      <span>Agent: {ticket.agent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">📚 Documentation</h5>
                  <p className="text-sm text-gray-600 mb-3">Complete guides and tutorials</p>
                  <Button size="sm" variant="outline">View Docs</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">🎥 Video Tutorials</h5>
                  <p className="text-sm text-gray-600 mb-3">Step-by-step video guides</p>
                  <Button size="sm" variant="outline">Watch Videos</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">💬 Community Forum</h5>
                  <p className="text-sm text-gray-600 mb-3">Connect with other users</p>
                  <Button size="sm" variant="outline">Join Forum</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold mb-2">📞 Schedule Call</h5>
                  <p className="text-sm text-gray-600 mb-3">Book a one-on-one session</p>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
              </div>
            </div>
          )}

          {/* Support Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-800">🎯 Your Support Benefits</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                  <div className="font-bold text-blue-600">&lt; 2 min</div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">24/7</div>
                <div className="text-gray-600">Availability</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">Dedicated</div>
                <div className="text-gray-600">Agent</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">Priority</div>
                <div className="text-gray-600">Queue</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrioritySupportCard;
